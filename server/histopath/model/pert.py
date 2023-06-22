"""PERT distribution."""

from typing import Any

import salabim as sim


class PERT(sim.Triangular):
    """
    PERT distribution. See: https://en.wikipedia.org/wiki/PERT_distribution

    Parameters:
        low : float
            lower bound of the distribution
        high : float
            upper bound of the distribution
            if omitted, `low` will be used, thus effectively a constant distribution
            `high` must be >= `low`
        mode : float
            mode of the distribution
            if omitted, the average of `low` and `high` will be used,
            thus a symmetric triangular distribution
            `mode` must be between `low` and `high`
        time_unit : str | None
            specifies the time unit
            must be one of "years", "weeks", "days", "hours", "minutes",
            "seconds", "milliseconds", "microseconds"
            default : no conversion
        randomstream: randomstream | None
            randomstream to be used
            if omitted, random will be used
            if used as random.Random(12299)
            it assigns a new stream with the specified seed
        env : Environment
            environment where the distribution is defined
            if omitted, default_env will be used
    """

    def __init__(
        self,
        low: float,
        high: float = None,
        mode: float = None,
        time_unit: str = None,
        randomstream: Any = None,
        env: sim.Environment = None,
    ):
        super().__init__(low, high, mode, time_unit, randomstream, env)
        self._shape = 4

        self._range = high - low
        self._alpha = 1 + self._shape * (mode - low) / self._range
        self._beta = 1 + self._shape * (high - mode) / self._range

        self._mean = (low + self._shape*mode + high) / (self._shape + 2)

    def __repr__(self):
        return "PERT"

    def print_info(self, as_str: bool = False, file: sim.TextIO = None) -> str:
        """
        Prints information about the distribution.

        Parameters:
            as_str: bool
                if False (default), print the info
                if True, return a string containing the info
            file: file
                if None(default), all output is directed to stdout
                otherwise, the output is directed to the file
        Returns:
            str: info (if as_str is True)
            None (if as_str is False)
        """
        result = []
        result.append("PERT " + hex(id(self)))
        result.append("  low=" + str(self._low) + " " + self.time_unit)
        result.append("  high=" + str(self._high) + " " + self.time_unit)
        result.append("  mode=" + str(self._mode) + " " + self.time_unit)
        result.append("  shape=" + str(self._shape))
        result.append("  randomstream=" + hex(id(self.randomstream)))
        return sim.return_or_print(result, as_str, file)

    def sample(self) -> float:
        """
        Returns:
            float: Sample of the distribtion
        """
        beta = self.randomstream.betavariate
        val = self._low + beta(self._alpha, self._beta) * self._range
        return val * self.time_unit_factor

    def mean(self) -> float:
        """
        Returns:
            float: Mean of the distribution
        """
        return self._mean * self.time_unit_factor
