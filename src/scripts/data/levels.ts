export type LevelConfig = {
	tilemap: string[][],
	blocksX: number,
	blocksY: number,
	floorAsset: string,
	nightTint: number
}

export type AssetMapEntry = {
	name: string,
	file: string,
	canPush: boolean,
	canHide: boolean,
	isExit: boolean
}

export default {
	level1: {
		tilemap: [
			["|", "*", "*", "*", "*", "|", "*", "*", "*", "*", "O", "*", "*", "*", "|"],
			["|", " ", " ", " ", " ", "|", " ", "H", "R", "R", " ", "B", " ", " ", "|"],
			["|", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
			["|", " ", " ", " ", " ", "|", " ", "B", " ", "B", " ", "H", " ", "B", "|"],
			["|", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
			["|", " ", " ", "H", " ", "*", " ", "B", "R", "H", " ", "R", " ", "B", "|"],
			["|", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
			["|", "*", "*", "O", "*", "*", " ", "*", "*", "O", "*", "*", " ", " ", "|"],
			["|", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#", " ", " ", " ", "|"],
			["|", " ", " ", " ", " ", "H", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
			["|", " ", " ", " ", " ", " ", " ", "|", " ", " ", "#", " ", " ", " ", "|"],
			["|", " ", " ", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
			["E", " ", " ", " ", " ", " ", " ", "|", " ", " ", " ", " ", " ", " ", "|"],
			["|", " ", " ", "H", " ", "B", " ", "|", " ", "R", " ", "B", " ", " ", "|"],
			["|", "|", "|", "|", "|", "|", "|", "|", "|", "|", "|", "|", "|", "|", "|"],
		],
		blocksX: 15,
		blocksY: 15,
		player1Start: {x: 1, y: 1},
		player2Start: {x: 13, y: 1},
		floorAsset: 'floor1',
		nightTint: 0xBF40BF,
		nextLevel: 'level2'
	}
}

export let assetMap = {
	"*": {
		name: "wall1",
		file: "assets/img/wall1.png",
		canPush: false,
		canHide: false,
		isExit: false
	},
	"H" : {
		name: "table2",
		file: "assets/img/table2.png",
		canPush: false,
		canHide: true,
		isExit: false
	},
	"|": {
		name: "wall2",
		file: "assets/img/wall2.png",
		canPush: false,
		canHide: false,
		isExit: false
	},
	"E": {
		name: "door",
		file: "assets/img/door.png",
		canPush: false,
		canHide: false,
		isExit: true
	},
	"B": {
		name: "box",
		file: "assets/img/box.png",
		canPush: false,
		canHide: false,
		isExit: false
	},
	"#": {
		name: "table",
		file: "assets/img/table.png",
		canPush: true,
		canHide: false,
		isExit: false
	},
	"S": {
		name: "skeleton",
		file: "assets/img/skeleton.png",
		canPush: false,
		canHide: false,
		isExit: false
	},
	"R": {
		name: "barrel",
		file: "assets/img/barrel.png",
		canPush: false,
		canHide: false,
		isExit: false
	},
	"O": {
		name: "hole",
		file: "assets/img/hole.png",
		canPush: false,
		canHide: true,
		isExit: false
	}
}