import multiprocessing
import os

import gevent.monkey

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gevent"
timeout = 1800  # half an hour
chdir = os.path.dirname(__file__)
proc_name = "mytardis_gunicorn"

#
# Server hooks
#
#   post_fork - Called just after a worker has been forked.
#
#       A callable that takes a server and worker instance
#       as arguments.
#
#   pre_fork - Called just prior to forking the worker subprocess.
#
#       A callable that accepts the same arguments as after_fork
#
#   pre_exec - Called just prior to forking off a secondary
#       master process during things like config reloading.
#
#       A callable that takes a server instance as the sole argument.
#

def post_fork(server, worker):
    # This would be done automatically by gevent a bit later, given that
    # we are using worker_class="gevent", but doing the monkey patching
    # earlier could help with this issue on Python 3.6:
    # https://github.com/benoitc/gunicorn/issues/1559
    gevent.monkey.patch_all()
