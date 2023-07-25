"""Entry point for: python -m histopath.webapp"""
from .app import App

my_app = App(name=__name__)

if __name__ == '__main__':
    my_app.run_server(debug=True)
