declare namespace NodeJS {
	interface Global {
		deref(ref: string): RoomObject;
		derefRoomPosition(protoPos: protoPos): RoomPosition;
		Overmind: IOvermind;
		flagCodes: { [category: string]: flagCat };
	}
}

declare var Overmind: IOvermind;
declare var flagCodes: { [category: string]: flagCat };

interface Game {
	cache: {
		assignments: { [ref: string]: { [roleName: string]: string[] } };
		targets: { [ref: string]: string[] };
		objectives: { [ref: string]: string[] };
		structures: { [roomName: string]: { [structureType: string]: Structure[] } };
		drops: { [roomName: string]: { [resourceType: string]: Resource[] } };
		constructionSites: { [roomName: string]: ConstructionSite[] };
	};
	icreeps: { [name: string]: ICreep };
}

interface ISetup {
	name: string;
	settings: any;
	roleRequirements: Function;
	bodyPatternCost: number;
	bodyCost(bodyArray: string[]): number;
	generateBody(availableEnergy: number, maxRepeats?: number): string[];
	generateLargestCreep(colony: IColony, {assignment, patternRepetitionLimit}: protoCreepOptions): protoCreep;
	onCreate(pCreep: protoCreep): protoCreep;
	create(colony: IColony, {assignment, patternRepetitionLimit}: protoCreepOptions): protoCreep;
}


interface CreepMemory {
	role: string;
	task: protoTask | null;
	assignmentRef: string | null;
	assignmentPos: protoPos | null;
	objectiveRef: string | null;
	colony: string;
	data: {
		origin: string;
		replaceAt: number;
		boosts: { [resourceName: string]: boolean }; // resourceName: if boost has been performed
		moveSpeed?: number;
		sayCount?: number;
		renewMe?: boolean;
	};
	roleData: {
		[propertyName: string]: any;
	}
	// Traveler components
	_travel: any;
	_trav: any;
}

interface FlagMemory {
	amount?: number;
	alwaysUp?: boolean;
	maxSize?: number;
	mineralType?: MineralConstant;
	IO?: string;
	maxAmount?: number;
	assignedRoom?: string;
	role?: string;
}

interface RoomMemory {
	colony: string;
	avoid?: number;
}

interface SpawnMemory {
}

interface ColonyMemory {
	overlord: OverlordMemory;
	hatchery: HatcheryMemory;
	commandCenter: CommandCenterMemory;
}

interface OverlordMemory {
}

interface HatcheryMemory {
	productionQueue: { [priority: number]: protoCreep[] };
	idlePos: protoPos;
}

interface CommandCenterMemory {
	idlePos: protoPos;
}

interface ICreep {
	// Creep properties
	creep: Creep;
	body: BodyPartDefinition[];
	carry: StoreDefinition;
	carryCapacity: number;
	fatigue: number;
	hits: number;
	hitsMax: number;
	id: string;
	memory: CreepMemory;
	name: string;
	pos: RoomPosition;
	ref: string;
	roleName: string;
	room: Room;
	spawning: boolean;
	ticksToLive: number;
	// Custom properties
	settings: any;
	task: ITask | null;
	// Creep methods
	attack(target: Creep | Structure): number;
	attackController(controller: StructureController): number;
	build(target: ConstructionSite): number;
	claimController(controller: StructureController): number;
	dismantle(target: Structure): number;
	drop(resourceType: string, amount?: number): number;
	getActiveBodyparts(type: string): number;
	harvest(source: Source | Mineral): number;
	move(direction: number): number;
	pickup(resource: Resource): number;
	rangedAttack(target: Creep | Structure): number;
	rangedMassAttack(): number;
	repair(target: Structure): number;
	reserveController(controller: StructureController): number;
	say(message: string, pub?: boolean): number;
	signController(target: Controller, text: string): number;
	suicide(): number;
	upgradeController(controller: StructureController): number;
	heal(target: Creep | ICreep): number;
	rangedHeal(target: Creep | ICreep): number;
	transfer(target: Creep | ICreep | Structure, resourceType: string, amount?: number): number;
	withdraw(target: Creep | ICreep | Structure, resourceType: string, amount?: number): number;
	travelTo(destination: RoomPosition | { pos: RoomPosition }, options?: any): number;
	// Custom creep methods
	log(...args: any[]): void;
	initializeTask(protoTask: protoTask): ITask | null;
	hasValidTask: boolean;
	isIdle: boolean;
	assertValidTask(): void;
	// assign(task: ITask): void;
	colony: IColony;
	lifetime: number;
	moveSpeed: number;
	needsReplacing: boolean;
	getBodyparts(partType: string): number;
	sayLoop(sayList: string[]): void;
	repairNearbyDamagedRoad(): number;
	assignment: RoomObject | null;
	assignmentPos: RoomPosition | null;
	inAssignedRoom: boolean;
	assignedRoomFlag: Flag | null;
	objective: IObjective | null;
	requestTask(): void;
	recharge(): void;
	newTask(): void;
	executeTask(): number | void;
	renewIfNeeded(): void;
	onRun(): void;
	init(): void;
	run(): void;
}

interface IColony {
	name: string;
	memory: ColonyMemory;
	roomNames: string[];
	room: Room;
	overlord: IOverlord;
	controller: StructureController;
	spawns: StructureSpawn[];
	extensions: StructureExtension[];
	storage: StructureStorage | undefined;
	links: StructureLink[];
	terminal: StructureTerminal | undefined;
	towers: StructureTower[];
	labs: StructureLab[];
	powerSpawn: StructurePowerSpawn | undefined;
	nuker: StructureNuker | undefined;
	observer: StructureObserver | undefined;
	commandCenter: ICommandCenter | undefined;
	hatchery: IHatchery;
	upgradeSite: IUpgradeSite;
	claimedLinks: StructureLink[];
	unclaimedLinks: StructureLink[];
	miningGroups: { [structID: string]: IMiningGroup } | undefined;
	miningSites: { [sourceID: string]: IMiningSite };
	incubating: boolean;
	outposts: Room[];
	rooms: Room[];
	flags: Flag[];
	creeps: ICreep[];
	creepsByRole: { [roleName: string]: ICreep[] };
	hostiles: Creep[];
	getCreepsByRole(roleName: string): ICreep[];
	sources: Source[];
	data: {
		numHaulers: number,
		haulingPowerSupplied: number,
		haulingPowerNeeded: number,
	};
	init(): void;
	run(): void;
}

interface flagActions {
	[actionType: string]: Function;
}

interface flagSubCat {
	color: number;
	secondaryColor: number;
	filter: Function;
	action: Function | null;
}

interface flagCat {
	color: number;
	filter: Function;
	action: flagActions | null;
	[subcat: string]: any;
}

interface protoCreep {
	body: BodyPartConstant[];
	name: string;
	memory: any;
}

interface protoCreepOptions {
	assignment?: RoomObject;
	patternRepetitionLimit?: number;
}

interface protoPos {
	x: number;
	y: number;
	roomName: string;
}

interface protoTask {
	name: string;
	_creep: {
		name: string;
	};
	_target: {
		ref: string;
		_pos: protoPos;
	};
	taskData: {
		targetRange: number;
		maxPerTask: number;
		maxPerTarget: number;
		moveColor: string;
	};
	data: {
		quiet: boolean;
		travelToOptions: any;
		resourceType?: string;
	};
}

interface ITask extends protoTask {
	creep: ICreep;
	target: RoomObject | null;
	targetPos: RoomPosition;
	remove(): void;
	isValidTask(): boolean;
	isValidTarget(): boolean;
	move(): number;
	step(): number | void;
	work(): number;
}

interface IResourceRequest {
	target: StructureLink | StructureContainer;
	amount: number;
	resourceType: string;
}

interface IResourceRequestGroup {
	resourceIn: {
		haul: IResourceRequest[],
		link: IResourceRequest[]
	};
	resourceOut: {
		haul: IResourceRequest[],
		link: IResourceRequest[]
	};
	registerResourceRequest(target: StructureLink | StructureContainer, resourceType?: string): void;
	registerWithdrawalRequest(target: StructureLink | StructureContainer, resourceType?: string): void;
}

interface IObjective {
	name: string;
	target: RoomObject;
	pos: RoomPosition;
	ref: string;
	creepNames: string[];
	maxCreeps: number;
	assignableToRoles: string[];
	assignableTo(creep: ICreep): boolean;
	getTask(): ITask;
	assignTo(creep: ICreep): void;
}

interface IObjectiveGroup {
	objectives: { [objectiveName: string]: IObjective[] };
	objectivesByRef: { [objectiveRef: string]: IObjective };
	objectivePriorities: string[];
	registerObjectives(...args: IObjective[][]): void;
	assignTask(creep: ICreep): void;
}

interface IHiveCluster {
	colonyName: string;
	room: Room;
	pos: RoomPosition;
	componentName: string;
	ref: string;
	overlord: IOverlord;
	colony: IColony;
	log(...args: any[]): void;
	init(): void;
	run(): void;
}

interface IMiningSite extends IHiveCluster {
	source: Source;
	energyPerTick: number;
	miningPowerNeeded: number;
	output: Container | Link | undefined;
	outputConstructionSite: ConstructionSite | undefined;
	miningGroup: IMiningGroup | undefined;
	predictedStore: number;
	miners: ICreep[];
}

interface IMiningGroup extends IHiveCluster {
	dropoff: StructureLink | StructureStorage;
	links: StructureLink[] | undefined;
	availableLinks: StructureLink[] | undefined;
	miningSites: IMiningSite[];
	parkingSpots: RoomPosition[];
	objectiveGroup: IObjectiveGroup;
	data: {
		numHaulers: number,
		haulingPowerSupplied: number,
		haulingPowerNeeded: number,
		linkPowerNeeded: number,
		linkPowerAvailable: number,
	};
}

interface ICommandCenter extends IHiveCluster {
	memory: CommandCenterMemory;
	storage: StructureStorage;
	link: StructureLink | undefined;
	terminal: StructureTerminal | undefined;
	towers: StructureTower[];
	labs: StructureLab[];
	powerSpawn: StructurePowerSpawn | undefined;
	nuker: StructureNuker | undefined;
	observer: StructureObserver | undefined;
	manager: ICreep;
	idlePos: RoomPosition;
}

interface IHatchery extends IHiveCluster {
	memory: HatcheryMemory;
	spawns: Spawn[];
	availableSpawns: Spawn[];
	extensions: Extension[];
	link: StructureLink;
	battery: StructureContainer;
	objectiveGroup: IObjectiveGroup;
	spawnPriorities: { [role: string]: number };
	supplier: ICreep;
	idlePos: RoomPosition;
	enqueue(protoCreep: protoCreep, priority?: number): void;
	uptime: number;
	energySpentInLastLifetime: number;
}

interface IUpgradeSite extends IHiveCluster {
	controller: StructureController;
	input: StructureLink | StructureContainer | null;
	inputConstructionSite: ConstructionSite | null;
}

interface IOvermind {
	name: string;
	Colonies: { [roomName: string]: IColony };
	colonyMap: { [roomName: string]: string };
	invisibleRooms: string[];
	Overlords: { [roomName: string]: IOverlord };
	init(): void;
	run(): void;
}

interface IOverlord {
	name: string;
	memory: OverlordMemory;
	room: Room;
	colony: IColony;
	settings: {
		incubationWorkersToSend: number;
		storageBuffer: { [role: string]: number };
		unloadStorageBuffer: number;
		reserveBuffer: number;
		maxAssistLifetimePercentage: number;
	};
	objectiveGroup: IObjectiveGroup;
	resourceRequests: IResourceRequestGroup;
	log(message: string): void;
	init(): void;
	assignTask(creep: ICreep): void;
	run(): void;
}
