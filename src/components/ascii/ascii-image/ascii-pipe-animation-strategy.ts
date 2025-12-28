import {
    createAsciiAnimationStrategy,
    type AsciiAnimationStrategy,
    type AsciiAnimationStrategyConstructor,
    type AsciiAnimationStrategyParams,
    type AsciiImagePresenter,
} from "./ascii-animation-strategy";

export type PipeStrategyItem =
    | AsciiAnimationStrategyConstructor
    | { strategy: AsciiAnimationStrategyConstructor; sync?: boolean };

export interface AsciiPipeAnimationStrategyParams
    extends AsciiAnimationStrategyParams {
    strategies: PipeStrategyItem[];
}

export class AsciiPipeAnimationStrategy implements AsciiAnimationStrategy {
    private strategies: PipeStrategyItem[];
    private strategyParams: AsciiAnimationStrategyParams;
    private currentStrategies: AsciiAnimationStrategy[] = [];
    private stages: PipeStage[] = [];
    private isStopped = false;

    constructor(params: AsciiPipeAnimationStrategyParams) {
        this.strategies = params.strategies;
        this.strategyParams = {
            asciiArt: params.asciiArt,
            presenter: params.presenter,
        };
    }

    public async animate(): Promise<void> {
        this.stop();
        this.isStopped = false;

        let currentInput = this.strategyParams.asciiArt;
        const asyncStrategies: { strategy: AsciiAnimationStrategy; item: PipeStrategyItem }[] = [];

        // Phase 1: Sequential Execution and Initialization
        for (const item of this.strategies) {
            if (this.isStopped) return;

            const StrategyClass = "strategy" in item ? item.strategy : item;
            const isSync = "sync" in item ? item.sync !== false : true;

            const strategyInstance = createAsciiAnimationStrategy(StrategyClass, this.strategyParams);
            this.currentStrategies.push(strategyInstance);

            if (isSync) {
                // Sequential: Run it fully using the real presenter for now
                // Subsequent strategies will start with the result of this one
                await strategyInstance.animate();
            } else {
                asyncStrategies.push({ strategy: strategyInstance, item });
            }
        }

        if (this.isStopped) return;

        // Phase 2: Build the Chain for Async Strategies
        let nextPresenter = this.strategyParams.presenter;

        // Build from right to left
        for (let i = asyncStrategies.length - 1; i >= 0; i--) {
            const { strategy } = asyncStrategies[i];
            const stage = new PipeStage(strategy, nextPresenter, currentInput);
            this.stages.unshift(stage);
            nextPresenter = stage;
        }

        // Phase 3: Start Async Strategies with their delegated presenters
        for (let i = 0; i < asyncStrategies.length; i++) {
            const { strategy } = asyncStrategies[i];
            const stage = this.stages[i];

            // Re-instantiate or re-configure the strategy with the stage as presenter?
            // Actually, we can't easily re-instantiate with a different presenter after creation 
            // without modifying the strategy interface to allow it.
            // But we can just monkey-patch or use a wrapper.
            // Since we use createAsciiAnimationStrategy, we have the instance.
            // We need the strategy to use our stage as its presenter.

            (strategy as any).presenter = stage;
            strategy.animate();
        }

        return Promise.resolve();
    }

    public stop(): void {
        this.isStopped = true;
        this.currentStrategies.forEach((strategy) => strategy.stop());
        this.currentStrategies = [];
        this.stages = [];
    }

    public getStrategies(): AsciiAnimationStrategy[] {
        return this.currentStrategies;
    }
}

class PipeStage implements AsciiImagePresenter {
    private latestInput: string;

    constructor(
        private readonly strategy: AsciiAnimationStrategy,
        private readonly nextPresenter: AsciiImagePresenter,
        initialInput: string
    ) {
        this.latestInput = initialInput;
    }

    // Called by the strategy when it wants to update
    updateUi(_text: string): void {
        this.republish();
    }

    // Called by the previous stage in the chain
    receive(text: string): void {
        this.latestInput = text;
        this.republish();
    }

    private republish(): void {
        const output = this.strategy.apply ? this.strategy.apply(this.latestInput) : this.latestInput;

        if (this.nextPresenter instanceof PipeStage) {
            this.nextPresenter.receive(output);
        } else {
            this.nextPresenter.updateUi(output);
        }
    }
}
