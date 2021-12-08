import { Day } from "./Day";

export class Day8 extends Day {
	getName(): string {
		return "Day 8";
	}

	constructor(inputPath: string) {
		super(inputPath);
		this.sevenSegmentMapDecoderArray = [];
		this.inputArray.forEach(input => this.sevenSegmentMapDecoderArray.push(new SevenSegmentMapDecoder(input)));
	}

	sevenSegmentMapDecoderArray: SevenSegmentMapDecoder[];

	problem1(): string {
		const lengthSet = new Set([2, 3, 4, 7]);
		return this.sevenSegmentMapDecoderArray.reduce((count: number, decoder: SevenSegmentMapDecoder) => {
			return count += decoder.countDigitsWithLength(decoder.fourDigitArray, lengthSet)
		}, 0).toString();
	}

	problem2(): string {
		return this.sevenSegmentMapDecoderArray.reduce((total: number, decoder: SevenSegmentMapDecoder) => {
			decoder.decodeTestArray();
			return total += decoder.totalFourDigitDecoded();
		}, 0).toString();
    }
}

class SevenSegmentMapDecoder {
	testDigitArray: string[] = [];
	fourDigitArray: string[] = [];

	decodedBinary: Record<number, number>;

	constructor(inputString: string) {
		inputString.split("|").forEach((segmentString, index) => {
			if (index === 0) {
				this.testDigitArray = segmentString.trim().split(" ");
			}
			else {
				this.fourDigitArray = segmentString.trim().split(" ");
			}
		});

		this.decodedBinary = {};
	}

	/**
	 * Counts number of segments with the given length in the length set
	 * @param array array of segments
	 * @param lengths set of lengths to count
	 * @returns number of matches
	 */
	countDigitsWithLength(array: string[], lengths: Set<number>): number {
		return array.reduce((count, sevenSegment) => {
			if (lengths.has(sevenSegment.length)) {
				count++;
			}
			return count;
		}, 0);
	}

	/**
	 * Returns the decimal representation of the unscrambled 4 panel input
	 * @returns decimal number
	 */
	totalFourDigitDecoded(): number {
		const len = this.fourDigitArray.length - 1;
		return this.fourDigitArray.reduce((total: number, digit, index) => total += Math.pow(10, len - index) * this.__segmentBinaryToOutput(this.__decodeDigit(digit)), 0);
	}

	/**
	 * Decodes the 10 input digits and maps scrambled binary to correct binary
	 */
	decodeTestArray() {
		let segmentCounter: Map<number, number> = new Map();

		//Initialize segments we care about
		let e = 0;
		let b = 0;
		let f = 0;
		let cf = 0;
		let ac = 0;
		let bcdf = 0;

		//Loop over all of the test digits and add up the number of times each segment appears
		//While looping, set the cf segments to equal the 1 digit (length 2) and bcdf to equal the 4 digit (length 4)
		this.testDigitArray.forEach((digit) => {
			let digitBinary = 0;
			for (let i = 0; i < digit.length; i++) {
				const segmentBinary = SegmentBinary[digit[i]];
				digitBinary += segmentBinary;
				segmentCounter.set(segmentBinary, (segmentCounter.get(segmentBinary) || 0) + 1);
			}
			switch (digit.length) {
				case 2:
					cf  = digitBinary;
					break;
				case 4:
					bcdf = digitBinary;
					break;
			}
		});
		
		//b e and f segments all have unique counts in the set of 10
		segmentCounter.forEach((count, segment) => {
			switch (count) {
				case 4:
					//E segment
					e = segment;
					this.decodedBinary[e]=SegmentBinary.e;
					break;
				case 6:
					b = segment;
					this.decodedBinary[b]=SegmentBinary.b;
					break;
				case 8:
					ac += segment;
					break;
				case 9:
					f = segment;
					this.decodedBinary[f]=SegmentBinary.f;
					break;
			}
		});

		//Given f, we can find c using the 2 segment input
		const c = cf - f;
		this.decodedBinary[c]=SegmentBinary.c;

		//Given c, we can find a from the 8 count segments
		const a = ac - c;
		this.decodedBinary[a]=SegmentBinary.a;
		
		//Given c segment, we can find d
		const d = bcdf - b - c - f;
		this.decodedBinary[d]=SegmentBinary.d;

		//Given the rest of the characters, set g
		const g = 0b1111111 - a - b - c - d - e - f;
		this.decodedBinary[g]=SegmentBinary.g;
	}

	/**
	 * Transforms a scrambled list of segments (a digit) into unscrambled binary
	 * @param digit scrambled digit
	 * @returns unscrambled binary
	 */
	private __decodeDigit(digit: string): number {
		let decoded=0;
		for (let i = 0; i < digit.length; i++) {
			decoded += this.decodedBinary[SegmentBinary[digit[i]]]
		}
		return decoded;
	}

	/**
	 * Translates a binary digit into a the seven segment panel number it represents
	 * @param binary unscrambled binary
	 * @returns decimal number for that digit
	 */
	private __segmentBinaryToOutput(binary: number) {
		switch (binary) {
			case 0b1110111:
				return 0;
			case 0b0100100:
				return 1;
			case 0b1011101:
				return 2;
			case 0b1101101:
				return 3;
			case 0b0101110:
				return 4;
			case 0b1101011:
				return 5;
			case 0b1111011:
				return 6;
			case 0b0100101:
				return 7;
			case 0b1111111:
				return 8;
			case 0b1101111:
				return 9;
			default:
				return -1;
		}
	}
}

/**
 * Binary representation of digits
 */
const SegmentBinary: Record<string, number> = {
	a: 1,
	b: 2,
	c: 4,
	d: 8,
	e: 16,
	f: 32,
	g: 64
}