from django.shortcuts import render
import pandas as pd
import numpy as np
import pymysql

from django.http import HttpResponse

import requests
import json
from pandas.core.frame import DataFrame
import time

from pyecharts.charts import Line, Pie
from pyecharts import options as opts
from pyecharts.globals import ThemeType

import requests

import random

from rest_framework.views import APIView


# Create your views here.
# 主页，让少量玩家的资料呈现在主页上
def index(request):
    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )
    sql = 'select * from player_info'
    df_info = pd.read_sql(sql, dbconn)

    name_list = df_info['name'].to_list()[0:19]
    steam_id_list = df_info['steam_id'].to_list()[0:20]
    info_list = []
    n = 0
    for i in name_list:
        player_dict = {'name': i, 'steam_id': steam_id_list[n]}
        n = n + 1
        info_list.append(player_dict)
    return render(request, '../static/../templates/index.html', context={'info_list': info_list})


# 查询名字呈现出基本资料
def check(request):
    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )
    sql = 'select * from player_info'
    df_info = pd.read_sql(sql, dbconn)

    user_name = request.POST["user_name"]
    print(user_name)
    if user_name == '':
        error = {'error': '用户名不能为空'}
        return render(request, '../static/../templates/index.html', error)
    else:
        key_word = user_name
        checked_df = df_info[df_info.name.str.contains(key_word)]
        steam_id_list = checked_df['steam_id'].to_list()
        name_list = checked_df['name'].to_list()

        info_list = []
        n = 0
        for i in name_list:
            player_dict = {'name': i, 'steam_id': steam_id_list[n]}
            n = n + 1
            info_list.append(player_dict)

        return render(request, '../static/../templates/index.html', context={'info_list': info_list})


# 在detail界面里画图
def judge(request):
    return HttpResponse(content=open("./templates/detail.html", encoding='UTF-8').read())


# “和谁在玩”功能
def toge(request):
    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )
    sql = 'select * from player_info'
    df_info = pd.read_sql(sql, dbconn)

    user_name = request.POST["user_name"]
    print(user_name)
    if user_name == '':
        error = {'error': '用户名不能为空'}
        return render(request, '../static/../templates/index.html', error)
    else:
        dbconn = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='19980621ty',
            database='player_info'
        )
        sql = 'select * from player_info'
        df_info = pd.read_sql(sql, dbconn)

        key_word = user_name
        checked_df = df_info[df_info.name.str.contains(key_word)]
        c_steam_id_list = checked_df['steam_id'].to_list()

        steam_id_list = []
        name_list = []

        for i in c_steam_id_list:
            url = 'https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=' + i
            response = requests.get(url)
            data = response.json()

            for i in data['last_match']['players']:
                steam_id_list.append(i['steam_id'])
                name_list.append(i['name'])

        info_list = []
        n = 0
        for i in name_list:
            player_dict = {'name': i, 'steam_id': steam_id_list[n]}
            n = n + 1
            info_list.append(player_dict)

    # print(info_list)
    return render(request, '../static/../templates/index.html', context={'info_list': info_list})


def response_as_json(data):
    json_str = json.dumps(data)
    response = HttpResponse(
        json_str,
        content_type="application/json",
    )
    response["Access-Control-Allow-Origin"] = "*"
    return response


def json_response(data, code=200):
    data = {
        "code": code,
        "msg": "success",
        "data": data,
    }
    return response_as_json(data)


JsonResponse = json_response


# 将pyecharts折线图所需资料发送至某个路由
def article_archive(request, steam_id):
    list_str = list(steam_id)
    list_str.pop(17)
    id = ''.join(list_str)
    url = 'https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=' + id + '&count=100'
    # print(url)
    response = requests.get(url)

    data = response.json()
    data_time = []
    data_result = []
    for i in data:
        timeStamp = i['timestamp']
        timeArray = time.localtime(timeStamp)
        otherStyleTime = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        data_time.append(otherStyleTime)
    t = 0
    for i in data:
        i['time'] = data_time[t]
        t = t + 1
        data_result.append(i)

    df_result = DataFrame(data_result).iloc[:, [0, 6]]
    df_result.iloc[::-1]
    x_list = df_result["time"].to_list()
    x_list.reverse()
    y_list = df_result["rating"].round(2).to_list()
    y_list.reverse()
    # 图表配置
    c = (
        Line()
            .add_xaxis(x_list)
            .add_yaxis(series_name="分数", y_axis=y_list)
            .set_global_opts(title_opts=opts.TitleOpts(title="分数变化折线图"),
                             tooltip_opts=opts.TooltipOpts(trigger="axis", axis_pointer_type="cross"),
                             yaxis_opts=opts.AxisOpts(
                                 min_=min(y_list) - 200)
                             # min_='dataMin')
                             )
            .dump_options_with_quotes()
    )

    return JsonResponse(json.loads(c))


# 计算方差和，当前分数和最高分数
def jisuan(request):
    id = request.GET.get('steam_id')
    name = request.GET.get('name')
    id = str(id)
    url = 'https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=' + id + '&count=80'
    # print("算标准差用的url = ", url)

    response = requests.get(url)
    data = response.json()
    rating_list = []
    for i in data:
        rating_list.append(i['rating'])

    arr_var = str(np.std(rating_list))
    print("有没有？",rating_list)
    if rating_list == []:
        rating_list = [0]
    else:
        max_rating = max(rating_list)

    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )
    dbconn.select_db('player_info')
    cursor = dbconn.cursor()
    sql = "SELECT * FROM player_info WHERE steam_id = " + id
    df_aim_player = pd.read_sql(sql, dbconn)

    print(str(df_aim_player))
    error_df = "Empty DataFrame\nColumns: [id, name, steam_id, highest_rating]\nIndex: []"
    # 对比之前该玩家的最高分和近50把的最高分，看看是否有新的最高分产生，如果有，就改正数据库里的最高分
    if str(df_aim_player) == error_df:
        new_highest_rating = "未知"
        print("未知")
    else:
        highest_rating = int(df_aim_player['highest_rating'].tolist()[0])
        if max_rating > highest_rating:
            sql = "update player_info set highest_rating = '" + str(max_rating) + "' where steam_id='" + id + "'"
            update = cursor.execute(sql)
            dbconn.commit()
        elif max_rating <= highest_rating:
            print('无需修改')

        sql = "SELECT * FROM player_info WHERE steam_id = " + id
        df_aim_player = pd.read_sql(sql, dbconn)
        new_highest_rating = df_aim_player['highest_rating'].tolist()[0]
        print(new_highest_rating)

    if np.std(rating_list) > 80:
        opinion = "可能是"
    else:
        opinion = "可能不是"
    average = str(format(sum(rating_list) / len(rating_list), '.0f'))
    print("平均值：", )
    id = str(id)

    return render(request, '../static/../templates/detail.html',
                  context={'std': arr_var, 'average': average, 'inning': len(rating_list), 'opinion': opinion,
                           'player_name': name, "new_highest_rating": new_highest_rating, 'now_rating': rating_list[0]})


def civ_article_archive(request, steam_id):
    list_str = list(steam_id)
    list_str.pop(17)
    id = ''.join(list_str)
    url = 'https://aoe2.net/api/player/matches?game=aoe2de&steam_id=' + id + '&count=80'

    response = requests.get(url)
    data = response.json()

    host_player = []
    civ_use = []
    for i in data:
        for j in i['players']:
            if j['steam_id'] == id:
                host_player.append(j)

    for i in host_player:
        civ_use.append(i['civ'])
    civ_use = list(filter(None, civ_use))

    response = requests.get('https://aoe2.net/api/strings?game=aoe2de&language=zh')
    data = response.json()
    civ = data['civ']

    civ_zh = []
    for i in civ_use:
        civ_zh.append(civ[i - 1]['string'])

    dict = {}
    for i in civ_zh:
        if i not in dict.keys():
            dict[i] = civ_zh.count(i)
    # print('常用民族字典：', [dict])

    from collections import Counter
    collection_words = Counter(civ_zh)
    most_counterNum = collection_words.most_common(1)

    keys = dict.keys()
    values = dict.values()
    civ_key = list(keys)
    civ_count = list(values)

    civ_data = [{'civ_key': civ_key, 'civ_count': civ_count}]
    df_civ = DataFrame(civ_data[0])

    c = (
        Pie()
            .add(
            "",
            [list(z) for z in zip(civ_key, civ_count)],
            radius=["30%", "80%"],
            center=["50%", "50%"],
            rosetype="radius",
            label_opts=opts.LabelOpts(is_show=True),
        )
            .set_global_opts(title_opts=opts.TitleOpts(title="ta的常用民族"),
                             legend_opts=opts.LegendOpts(is_show=False))
            .set_series_opts(label_opts=opts.LabelOpts(is_show=True, formatter='{b}:{c}'))
            .dump_options_with_quotes()
    )
    return JsonResponse(json.loads(c))


def most_civ(request):
    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )

    sql = 'select * from use_civ'
    civ_info = pd.read_sql(sql, dbconn)
    # print(civ_info)

    name_list = civ_info['name'].to_list()[0:20]
    steam_id_list = civ_info['steam_id'].to_list()[0:20]
    favor_civ = civ_info['favo_civ'].to_list()[0:20]
    profile_id = civ_info['profile_id'].to_list()[0:20]
    use_percent = civ_info['use_percent'].to_list()[0:20]
    info_list = []
    n = 0
    for i in name_list:
        player_dict = {'name': i, 'steam_id': steam_id_list[n], 'favor_civ': favor_civ[n], 'profile_id': profile_id[n],
                       'use_percent': use_percent[n]}
        n = n + 1
        info_list.append(player_dict)
    # print(info_list)
    return render(request, '../static/../templates/videoDL.html', context={'info_list': info_list})


def check_civ(request):
    civ_name = request.POST["civ_name"]
    print("获取到的civ",civ_name)
    dbconn = pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='19980621ty',
        database='player_info'
    )
    dbconn.select_db('player_info')
    cursor = dbconn.cursor()
    sql = "SELECT * FROM use_civ WHERE favo_civ = '" + civ_name + "'"
    df_aim_player = pd.read_sql(sql, dbconn)
    print(df_aim_player)

    name_list = df_aim_player['name'].to_list()
    steam_id_list = df_aim_player['steam_id'].to_list()
    favor_civ = df_aim_player['favo_civ'].to_list()
    profile_id = df_aim_player['profile_id'].to_list()
    use_percent = df_aim_player['use_percent'].to_list()
    info_list = []
    n = 0
    for i in name_list:
        player_dict = {'name': i, 'steam_id': steam_id_list[n], 'favor_civ': favor_civ[n], 'profile_id': profile_id[n],
                       'use_percent': use_percent[n]}
        n = n + 1
        info_list.append(player_dict)
    return render(request, '../static/../templates/videoDL.html', context={'info_list': info_list})

def about(request):
    return render(request, '../static/../templates/about.html')

# 微信小程序所需api数据缓存url两个
def with_api(request):
    steam_id = request.GET.get('steam_id')
    # print(steam_id)
    url = 'https://aoe2.net/api/player/lastmatch?game=aoe2de&steam_id=' + steam_id
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)

def check_api(request):
    steam_id = request.GET.get('steam_id')
    # print(steam_id)
    url = 'https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=4&steam_id=' + steam_id + '&count=100'
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)

def solo_api(request):
    steam_id = request.GET.get('steam_id')
    # print(steam_id)
    url = 'https://aoe2.net/api/player/ratinghistory?game=aoe2de&leaderboard_id=3&steam_id=' + steam_id + '&count=100'
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)
