const randomName = require('random-name');

class Random {

	static name() {
		return [randomName.first(), randomName.last()].join(' ');
	}

	static number(min, max, roundTo = 1) {
		return Math.round((Math.random() * (max - min) + min) * Math.pow(10, roundTo)) / Math.pow(10, roundTo);
	}

	static integer(min, max) {
		return Math.floor(this.number(min, max));
	}

	static date() {
		return new Date(+(new Date()) - Math.floor(Math.random()*10000000000)).toISOString();
	}

	static gender() {
		const genders = ['M', 'F'];
		return genders[this.integer(0, 10) % 2];
	}
}

module.exports = Random;
