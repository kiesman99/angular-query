import { AfterViewInit, Component, ElementRef, ViewChild, isDevMode } from "@angular/core";
import { TanstackQueryDevtools } from "@tanstack/query-devtools";
import { injectQueryClient } from "./context";
import { onlineManager } from "@tanstack/query-core";

@Component({
    selector: 'angular-query-devtools',
    standalone: true,
    imports: [],
    template: `
        <div class="tsqd-parent-container" #tsqdContainer></div>
    `
})
export class AngularQueryDevtools implements AfterViewInit {
    @ViewChild('tsqdContainer')
    tsqdContainer?: ElementRef;

    devTools?: TanstackQueryDevtools;

    private readonly client = injectQueryClient();

    ngAfterViewInit(): void {
        const cli = this.client;
        const container = this.tsqdContainer;
        // if (isDevMode()) {
            import('@tanstack/query-devtools').then(m => {
                const QueryDevtools = m.TanstackQueryDevtools;

                this.devTools = new QueryDevtools({
                    client: cli,
                    queryFlavor: 'Angular Query',
                    version: '5',
                    onlineManager: onlineManager,
                    buttonPosition: 'bottom-right',
                    position: 'bottom',
                    initialIsOpen: false,
                    errorTypes: []
                });

                this.devTools.mount(container?.nativeElement);
            });
        // }
    }
}