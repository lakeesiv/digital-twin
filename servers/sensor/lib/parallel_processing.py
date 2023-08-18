#!/usr/bin/python
#author: Dr. Jorge Merino
#organisation: University of Cambridge. Institute for Manufacturing.
#date: 2021.04.29
#license: GPL-3.0 (GNU General Public License version 3): https://opensource.org/licenses/GPL-3.0
#references: https://stackoverflow.com/questions/19846332/python-threading-inside-a-class/19846691
#references: https://realpython.com/intro-to-python-threading/#starting-a-thread

from threading import Thread
from concurrent.futures import Future

#stores the output of the function to be threaded in a future
def call_with_future(fn, future, args, kwargs):
    try:
        result = fn(*args, **kwargs)
        future.set_result(result)
    except Exception as exc:
        future.set_exception(exc)

#decorator for threaded functions.

def threaded(fn):
    # Creates and runs a thread with the function. The target funtion is wrapped into another function with a Future.
    # The Future is passed as an attribute of the wrapping function and will store the output of the target function.
    def wrapper(*args, **kwargs):
        future = Future()
        Thread(target=call_with_future, args=(fn, future, args, kwargs)).start()
        return future
    return wrapper


# same decorator using threadpools instead of two separate functions
# Remember you have to tp.shutdown() after you're done with all parallel work.
from concurrent.futures import ThreadPoolExecutor
tp = ThreadPoolExecutor(10)  # max 10 threads
def threaded_pool(fn):
    def wrapper(*args, **kwargs):
        return tp.submit(fn, *args, **kwargs)  # returns Future object
    return wrapper

########################## Examples ###############################

#example of a threaded function
@threaded_pool
def example_threaded_fn():
    #todo: make something Here
    return 1

#example of a function that uses the output of the called threaded function
def example_call_with_future_to_threaded_fn():
    fut = example_threaded_fn()  # this will run in a separate thread
    print(fut.result())


#example of a function that uses the output of the called threaded function
def example_call_with_future_to_threded_fn():
    fut = example_threaded_fn()  # this will run in a separate thread
    # concurrent work finished
    tp.shutdown()
    print(fut.result())
