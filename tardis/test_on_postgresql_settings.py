# pylint: disable=wildcard-import,W0401,W0614
from tardis.test_settings import *  # noqa # pylint: disable=W0614

DATABASES = {
    'default': {
        'ENGINE':   "django.db.backends.postgresql_psycopg2",
        'NAME':     "tardis",
        'USER':     "mytardis",
        'PASSWORD': "password",
        'HOST':     "localhost",
        'PORT':     "5432",
    }
}
