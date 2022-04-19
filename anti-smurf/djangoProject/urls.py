"""djangoProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path

from user.views import index, check, judge, toge, article_archive, civ_article_archive, jisuan, most_civ, check_civ, about, with_api, check_api, solo_api

from django.conf.urls import url, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('check', check, name='check'),
    path('toge', toge, name='toge'),

    path('player', jisuan, name='jisuan'),
    path('player', judge, name='player'),

    path('videodl', most_civ, name='civ_dl'),
    path('check_civ', check_civ, name='check_civ'),
    path('about', about, name='about'),

    path('api/with', with_api, name='api_with'),
    path('api/check', check_api, name='api_check'),
    path('api/solo', solo_api, name='api_solo'),

    re_path(r'^data/(?P<steam_id>[0-9]{17}/$)', article_archive, name='data'),
    re_path(r'^civ/(?P<steam_id>[0-9]{17}/$)', civ_article_archive, name='civ'),

    url(r'^user/', include('user.urls'))
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)