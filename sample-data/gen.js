const fs = require('fs');
const Random = require('./random');

class SalesCSV {
	
	#headers = ['USER_NAME', 'AGE', 'HEIGHT', 'GENDER', 'SALE_AMOUNT', 'LAST_PURCHASE_DATE'];
	
	#stream = null;

	#fileName = '../sales.csv';

	constructor(options = null) {
		this.finish = options?.finish || null;
	}

	open(file = null) {
		if (this.#stream !== null) {
			this.close();
		}
		this.#stream = fs.createWriteStream(file || this.#fileName);
		if (typeof this.finish === 'function') {
			this.#stream.on('finish', function() {
				console.log('stream on finish!!');
				this.finish();
			});
		}
	}

	close() {
		try {
			this.#stream?.end();
		} catch (e) {
			console.error('close stream error!', e);
		}
	}

	generate(records = 10000) {
		this.open();
		this.writeHeader();
		let count = 0;
		for (count = 0; count < records; count++) {
			let row = [
				Random.name(),
				Random.integer(16, 65),
				Random.number(140, 210, 0),
				Random.gender(),
				Random.number(100, 9999999),
				Random.date()
			];
			this.write(row);
		}
		this.close();
	}

	writeHeader() {
		this.write(this.#headers, 'UTF8');
	}

	write(row) {
		if (!this.#stream) {
			throw new Error('No stream is created!');
		}

		this.#stream.write(Array.isArray(row) ? row.join(',') : row, 'UTF8');
		this.#stream.write('\n');
	}
}

function main() {
	
	const salesCSV = new SalesCSV();

	salesCSV.generate(process.env.LINE || 10);

	console.log('done');
}

main();


