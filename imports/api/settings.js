import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Settings = new Mongo.Collection('settings');

if (Meteor.isServer) {
	Meteor.publish('settings', function () {
		return Settings.find({ owner: this.userId });
	});
	Meteor.publish('setting', function (key) {
		check(key, String);
		return Settings.find({ owner: this.userId , key });
	});
}

Meteor.methods({

	'settings.update'(key, value) {

		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const updatedAt = new Date();
		const owner = this.userId;
		const username = Meteor.users.findOne(this.userId).username;

		Settings.upsert( { owner , key }, {
			$set: {
				owner ,
				key ,
				value ,
			}
		} ) ;
	},

	'settings.reset'(key){
		check(key, String);
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		return Settings.remove({owner: this.userId, key});
	},

});

const methods = {
  update: 'settings.update',
  reset: 'settings.reset',
} ;

const defaults = {
  'navigation-drawer-is-open' : 'closed' ,
  'currency' : 'EUR',
  'lang' : 'en' ,
  'appointment-duration' : [ 15 * 60 * 1000 , 30 * 60 * 1000 ] ,
  'important-strings' : [] ,
  'week-starts-on' : 1 ,
  'text-transform' : 'uppercase' ,
  'iban': '',
  'account-holder': '',
} ;

function get ( key ) {
  const item = Settings.findOne({key});
  if ( item === undefined ) return defaults[key];
  return item.value ;
}

function subscribe ( key ) {
  return Meteor.subscribe('setting', key);
}

const settings = {
  defaults ,
  get ,
  subscribe ,
  methods ,
} ;

export {
  Settings,
  settings,
}
