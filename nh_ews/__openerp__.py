# Part of Open eObs. See LICENSE file for full copyright and licensing details.
# -*- coding: utf-8 -*-
{
    'name': 'NH Early Warning Score',
    'version': '0.1',
    'category': 'Clinical',
    'license': 'AGPL-3',
    'summary': '',
    'description': """    """,
    'author': 'Neova Health',
    'website': 'http://www.neovahealth.co.uk/',
    'depends': ['nh_observations'],
    'data': [
        'views/views.xml',
        'security/notif/ir.model.access.csv',
        'security/params/ir.model.access.csv',
        'security/ir.model.access.csv',
        'data/data.xml'
    ],
    'demo': ['data/ward_a/demo_news.xml',
             'data/ward_b/demo_news.xml',
             'data/ward_c/demo_news.xml',
             'data/ward_d/demo_news.xml',
             'data/ward_e/demo_news.xml'],
    'css': [],
    'js': [],
    'qweb': [],
    'images': [],
    'application': True,
    'installable': True,
    'active': False,
}
