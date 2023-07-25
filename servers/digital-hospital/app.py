from flask import Flask, request, jsonify
from simulation import simulate, get_all
app = Flask(__name__)


@app.route('/simulate', methods=['POST'])
def simulation():
    data = request.get_json()
    # get weeks attribute from data
    weeks = data.get("weeks", 1)
    print("Simulating for {} weeks".format(weeks))
    app = simulate(weeks=weeks)
    print("Simulation complete")

    return jsonify(get_all(app))


if __name__ == '__main__':
    app.run(debug=True)
