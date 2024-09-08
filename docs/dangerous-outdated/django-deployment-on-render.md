# How to Deploy a Django App on Render

<div style="display: flex; flex-direction: row;">
<img src="https://www.svgrepo.com/show/373554/django.svg" width="150px" height="auto">
<img src="https://www.svgrepo.com/show/532994/plus.svg" width="150px" height="auto">
<img src="https://cdn.sanity.io/images/34ent8ly/production/ec37a3660704e1fa2b4246c9a01ab34e145194ad-824x824.png
" width="150px" height="auto">
</div>

## Pre-Requirements

- A Django app running in development mode
- Web service (at least starter plan) on [Render](https://render.com/)
- Docker ([Installation](https://docs.docker.com/engine/install/ubuntu/))

## Deployment

### Seperating the Settings

You may have already split your settings into a base settings file that contains everything that stays consistent across development, test and production, and a test settings file for running the tests. We will use exactly the same principle to separate development and production settings.

For example the `INSTALLED_APPS` should be the same in very state, but `DEBUG` is only enabled in Development Mode.

After seperating the files, your `config` folder should look something like this:

```
config/
    settings/
        __init__.py
        base.py
        prod.py
        dev.py
    urls.py
    wsgi.py
    asgi.py
```

> **Important**: You have to change `BASE_DIR = Path(__file__).resolve().parent.parent` in the `base.py` file to `BASE_DIR = Path(__file__).resolve().parent.parent.parent`.

Now we will use the environment variables to decide if the app is running in production or in development mode. To do this, we have to change `config/asgi.py`, `config/wsgi.py` and `manage.py` by replacing `os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')` with `os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev"))`.

Now we can choose between development and production mode by setting the environment variable `DJANGO_SETTINGS_MODULE`.

**Examples**:

- `DJANGO_SETTINGS_MODULE=unset`: Running in dev mode
- `DJANGO_SETTINGS_MODULE=config.settings.prod`: Running in prod mode

### Setting Environment Variables with Dotenv

Environment variables are important to keep important and sensitive data (database connections, passwords, etc.) secret. Before we can you dotenv we have to install the package `python-dotenv`. Replace all important data with environment variables.

### Extending the Settings

Before we can deploy the app we need to make several changes to `base.py` and `prod.py`.

**base.py**:

1. Set `ALLOWED_HOSTS` to a list of addresses and domains through which the website should be accessible.
2. Install whitenoise and set `STATICFILES_STORAGE` to `"whitenoise.storage.CompressedManifestStaticFilesStorage"`.
3. Set `NPM_BIN_PATH` to `"/usr/bin/npm"`.

**prod.py**:

1. Set `DEBUG`to `False` (if not already done).
2. Set `SECURE_HSTS_SECONDS` to `31536000`.
3. Set `SESSION_COOKIE_SECURE`, `SECURE_HSTS_INCLUDE_SUBDOMAINS` and `SECURE_HSTS_PRELOAD` to `True`.
4. Set `CSRF_TRUSTED_ORIGINS` to `[f"https://{host}" for host in ALLOWED_HOSTS]`

### Creating the Dockerfile

In the last step we have to create a `Dockerfile` in the root folder and insert the following content:

```docker
# Replace with the latest Python version
FROM python:3.12

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DJANGO_SETTINGS_MODULE=config.settings.prod

# Set the working directory
WORKDIR /app

RUN python --version

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install dependencies for MariaDB
RUN apt-get update && \
    apt-get install -y python3-dev default-libmysqlclient-dev build-essential pkg-config

# Install Poetry
RUN pip install poetry

# Copy pyproject.toml and poetry.lock
COPY pyproject.toml poetry.lock /app/

# Configure Poetry to not use virtualenvs
RUN poetry config virtualenvs.create false

# Install Python dependencies
RUN poetry install --no-dev --no-root

# Copy the entire project
COPY . /app/

# Install Tailwind CSS (requires Node.js and npm)
RUN python manage.py tailwind install --no-input;

# Build Tailwind CSS
RUN python manage.py tailwind build --no-input;

# Collect static files
RUN python manage.py collectstatic --no-input;

# Make migrations
RUN python manage.py makemigrations --no-input;

# Migrate the database
RUN python manage.py migrate --no-input;

# Expose port 8000
EXPOSE 8000

# Start the application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

**🎉 Happy Deployment! 🎉**
