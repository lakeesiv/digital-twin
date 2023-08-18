import logging
from abc import ABC, abstractmethod


class Decoder_Abstract(ABC):
    @abstractmethod
    def decode(self, message, topic=None, logger=logging.getLogger()):
        pass
