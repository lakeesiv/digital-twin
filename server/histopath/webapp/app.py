"""The web app."""

from base64 import b64decode
from io import BytesIO
from statistics import mean

import dash_bootstrap_components as dbc
import diskcache
import pandas as pd
from dash import (Dash, DiskcacheManager, Input, Output, State, dcc, html,
                  no_update)
from dash.dash_table import DataTable
from dash.dash_table.Format import Format, Scheme
from plotly import express as px

from ..model import Model

cache = diskcache.Cache("./cache")
background_callback_manager = DiskcacheManager(cache)


class App(Dash):
    """The web app."""

    def __init__(self,
                 title="CUH Histopathology simulation demo",
                 prevent_initial_callbacks=True,
                 suppress_callback_exceptions=True,
                 external_stylesheets=None,
                 **kwargs):
        """Override Dash constructor to setup layout and callbacks."""

        if external_stylesheets is None:
            external_stylesheets = [dbc.themes.BOOTSTRAP, dbc.icons.BOOTSTRAP]

        super().__init__(
            title=title,
            prevent_initial_callbacks=prevent_initial_callbacks,
            suppress_callback_exceptions=suppress_callback_exceptions,
            external_stylesheets=external_stylesheets,
            **kwargs)
        self.layout = __class__.LAYOUT

        @self.callback(
            Output('upload-status', 'children'),
            Output('simulate-button', 'disabled'),
            Output('sim-results', 'children', allow_duplicate=True),
            Output('simulate-button', 'color'),
            Output('upload-store', 'data'),
            Input('file-upload', 'contents'),
            State('file-upload', 'filename'),
        )
        def upload_file(contents, filename):
            if contents is None:
                return no_update
            try:
                if not filename.endswith('.xlsx'):
                    raise ValueError(f'uploaded file "{filename}" is not an .xlsx file.')
                # file_contents: base64 encoded string
                _, file_contents = contents.split(',')
                data = file_contents
                return (
                    dcc.Markdown(
                        f'Sucessfully uploaded "{filename}".',
                        style={"color": "#009900"}),
                    False,
                    [],
                    'success',
                    data)
            except Exception as exception:
                return (
                    dcc.Markdown(
                        f"**{type(exception).__name__}**: {str(exception)}",
                        style={"color": "red"}),
                    True,
                    [],
                    'secondary',
                    None)

        @self.callback(
            Output('sim-results', 'children', allow_duplicate=True),
            Input('simulate-button', 'n_clicks'),
            State('upload-store', 'data'),
            background=True,
            manager=background_callback_manager,
            running=[
                (Output("simulate-button", "disabled"), True, False),
                (
                    Output("sim-results", "children"),
                    html.B('Simulating...'),
                    []
                )])
        def simulate(_, data):
            try:
                b_io = BytesIO(b64decode(data))
                model = Model(random_seed="*", time_unit="hours", config_file=b_io)
                model.run(model.weeks(4), animate=False)
                return result_html(model)
            except Exception as exception:
                return (
                    dcc.Markdown(
                        f"**{type(exception).__name__}**: {str(exception)}",
                        style={"color": "red"}))

    LAYOUT = html.Div(
        [
            html.H1(children='CUH Histopathology simulation demo', style={'textAlign': 'center'}),
            html.Div(
                [
                    html.Div(
                        [
                            dcc.Upload(
                                [dbc.Button('Upload config file', color='primary')],
                                id='file-upload',
                                multiple=False
                            ),
                            dbc.Button(
                                "Simulate!",
                                id="simulate-button",
                                disabled=True,
                                color='secondary'
                            )
                        ],
                        className='d-flex gap-2'),
                    html.Div(html.Span("Uploaded file: None"), id='upload-status')],
                className='mb-3'),

            html.Div(id='sim-results'),
            dcc.Store(id='upload-store')],
        style={"width": "900px", "margin": "20px"})


def result_html(model: Model):
    """Generate a dash Component to show simulation results.
    It is assumed that run_model(model, ...) was called previously."""

    specimen_log = {s.name(): s.data for s in model.completed_specimens.as_list()}

    # TODO: eventually we will have more resources and will need to do this more cleverly

    resource_df = {
        "resource": ["Booking-in staff"],
        "busy": [model.resources["Booking-in staff"].claimed_quantity.mean()],
        "scheduled": [model.resources["Booking-in staff"].capacity.mean()],
        "utilisation": [
            model.resources["Booking-in staff"].claimed_quantity.mean()
            / model.resources["Booking-in staff"].capacity.mean()],
        "waiting": [model.resources["Booking-in staff"].requesters().length.mean()]
    }
    resource_df = pd.DataFrame(resource_df)

    resource_spec = [
        {
            "id": 'resource',
            "name": 'Resource'},
        {
            "id": 'busy',
            "name": 'Mean busy',
            "type": 'numeric',
            "format": Format(precision=4, scheme=Scheme.fixed)},
        {
            "id": 'scheduled',
            "name": 'Mean scheduled',
            "type": 'numeric',
            "format": Format(precision=4, scheme=Scheme.fixed)},
        {
            "id": 'utilisation',
            "name": 'Mean utilisation',
            "type": 'numeric',
            "format": Format(precision=2, scheme=Scheme.percentage)},
        {
            "id": 'waiting',
            "name": 'Mean waiting tasks',
            "type": 'numeric',
            "format": Format(precision=4, scheme=Scheme.fixed)}]

    mean_time = mean([
        (dic["bookedInTime"] - dic["arrivedTime"])
        for dic in specimen_log.values()])
    time_unit = model.get_time_unit()

    specimen_df = {
        "stage": ["Arrival to Booked In"],
        "mean_time": [
            f'{mean_time:.4}{"" if time_unit == "n/a" else " "+time_unit}']}
    specimen_df = pd.DataFrame(specimen_df)

    specimen_spec = [
        {
            "id": 'stage',
            "name": ''},
        {
            "id": 'mean_time',
            "name": 'Mean time',
            "type": 'numeric',
            "format": Format(precision=4, scheme=Scheme.fixed)}]

    df_t: pd.DataFrame = model.resources["Booking-in staff"].requesters().length.as_dataframe()
    df_t.columns = ["t", "waiting_tasks"]
    fig = px.line(
        df_t,
        x="t",
        y="waiting_tasks")
    fig.update_layout(
        title='Booking-in staff',
        xaxis_title='Time (hours)',
        yaxis_title='Waiting tasks')

    return html.Div(
        [
            html.H3("Resource statistics"),
            DataTable(resource_df.to_dict('records'), resource_spec),
            html.H3("Specimen statistics"),
            DataTable(specimen_df.to_dict('records'), specimen_spec),
            dcc.Graph(figure=fig)])
