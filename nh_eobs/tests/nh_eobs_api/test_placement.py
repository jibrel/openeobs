# -*- coding: utf-8 -*-
from openerp.tests.common import TransactionCase


class TestPlacement(TransactionCase):

    def setUp(self):
        super(TestPlacement, self).setUp()
        self.test_utils_model = self.env['nh.clinical.test_utils']
        self.test_utils_model.admit_patient()
        self.hospital_number = self.test_utils_model.hospital_number

        self.spell_activity_id = self.test_utils_model.spell_activity_id
        self.domain = [
            ('data_model', '=', 'nh.clinical.patient.observation.ews'),
            ('spell_activity_id', '=', self.spell_activity_id),
            ('state', 'not in', ['completed', 'cancelled'])
        ]
        self.activity_model = self.env['nh.activity']
        self.api_model = self.env['nh.eobs.api']

    def test_new_obs_created(self):
        # Only cancel when transfer successful.
        open_obs_activities = self.activity_model.search(self.domain)
        self.assertEqual(len(open_obs_activities), 0)

        self.test_utils_model.place_patient()

        open_obs_activities = self.activity_model.search(self.domain)
        self.assertEqual(len(open_obs_activities), 1)

    def test_new_obs_due_in_15_minutes(self):
        self.test_utils_model.place_patient()

        open_obs_activities = self.activity_model.search(self.domain)
        self.assertEqual(len(open_obs_activities), 1)
        open_obs_activity = open_obs_activities[0]
        self.assertEqual(open_obs_activity.data_ref.frequency, 15)

    def test_new_obs_due_in_15_minutes_after_transfer(self):
        self.test_utils_model.place_patient()
        # open_obs_activities = self.activity_model.search(self.domain)
        # first_obs_after_placement = open_obs_activities[0]
        # TODO Uncomment 2 lines above when EOBS-690 has been completed.

        self.api_model.transfer(self.hospital_number, {'location': 'WB'})

        # Need to check first obs is cancelled otherwise we will get false
        # positives from the later assertions.
        # self.assertEqual(first_obs_after_placement.state, 'cancelled')
        # TODO Uncomment line above when EOBS-690 has been completed.

        # Place patient again on new ward.
        self.test_utils_model.place_patient()

        open_obs_activities = self.activity_model.search(self.domain)
        self.assertEqual(len(open_obs_activities), 1)
        open_obs_activity = open_obs_activities[0]
        self.assertEqual(open_obs_activity.data_ref.frequency, 15)
