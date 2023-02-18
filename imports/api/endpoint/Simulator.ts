type Arg = any;

type Simulator = (...args: Arg[]) => Promise<undefined> | undefined;

export default Simulator;
