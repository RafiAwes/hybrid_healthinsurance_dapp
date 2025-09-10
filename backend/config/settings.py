import os
from urllib.parse import urlparse, parse_qsl
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-y+pn+qg@kd*c472fx-!ryn&8ndw31@4eulwq$oe8p2!-ogpm5-'

DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'insurance',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASEURL = urlparse('postgresql://neondb_owner:npg_IQPExeG21pUN@ep-raspy-sunset-a1pbgt5r-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
EXTERNAL_DATABASE_URL = urlparse('postgresql://hospital_owner:npg_GBK2Vb7arTvu@ep-fancy-bonus-a1ynfmax-pooler.ap-southeast-1.aws.neon.tech/hospital?sslmode=require&channel_binding=require')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': DATABASEURL.path.replace('/', ''),
        'USER': DATABASEURL.username,
        'PASSWORD': DATABASEURL.password,
        'HOST': DATABASEURL.hostname,
        'PORT': DATABASEURL.port or 5432,
        'OPTIONS': {
            'sslmode': 'require',
            # 'options': 'endpoint=ep-raspy-sunset-a1pbgt5r',
            },
    },
    'external':{
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': EXTERNAL_DATABASE_URL.path.lstrip('/'),
        'USER': EXTERNAL_DATABASE_URL.username,
        'PASSWORD': EXTERNAL_DATABASE_URL.password,
        'HOST': EXTERNAL_DATABASE_URL.hostname,
        'PORT': EXTERNAL_DATABASE_URL.port or 5432,
        'OPTIONS': {
            'sslmode': 'require',
            # 'options': 'endpoint=ep-fancy-bonus-a1ynfmax',
        },
    }

}

AUTH_USER_MODEL = 'insurance.AdminUser'

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
