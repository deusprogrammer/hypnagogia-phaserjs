export type LevelConfig = {
	tilemap: string[][],
	blocksX: number,
	blocksY: number,
	blockAsset: string,
	breakableAsset: string
}

export default {
	level1: {
		tilemap: [
			[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
			[" ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
			[" ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
			[" ", "*", " ", "*", "#", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " "],
			[" ", "*", " ", "*", "#", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", " ", " ", " ", " "],
			[" ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", " ", " ", " "],
			[" ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
			[" ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " ", "*", " "],
			[" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
		],
		blocksX: 15,
		blocksY: 15,
		blockAsset: 'block',
		breakableAsset: 'breakable'
	}
}