// taken from https://github.com/OmarShehata/vite-hot-reload-example/blob/main/src/HotModuleReloadSetup.js
// by Omar Shehata, with minor modifications

// This module is used to handle hot module reloads.
//
// Vite's Hot Module Reload (HMR) can avoid the need to reload the page
// when a module is updated. If the module includes code that checks
// import.meta.hot, then Vite will swap out the module when it is updated
// instead of reloading the page.
//
// Vite will also look for a class method called hotReload() that will
// be called with the old module instance as an argument. This method
// can implement copying of the state from the old module to the new module.
// So far, only the World module has implemented this method.

import { ModuleNamespace } from "vite/types/hot.js";

class HotModuleReloadSetup {
    private modules: Record<string, any> = {};
    public instances: Record<string, any> = {};
    private constructorArgs: Record<string, any> = {};

	constructor() {
		this.modules = {};
		this.instances = {};
		this.constructorArgs = {};

		document.body.addEventListener('hot-module-reload', (event: Event) => {
			const { newModule } = (event as CustomEvent).detail;
			this.swapModule(newModule)
		});
	}

	swapModule(newModule: ModuleNamespace) {
		const name = newModule.default.name;
		const oldModule = this.modules[name];
		const oldInstance = this.instances[name]
		if (!oldModule) return;

		const newInstance = new newModule.default(...this.constructorArgs[name]);
  		newInstance.hotReload(oldInstance)

  		this.modules[name] = newModule
  		this.instances[name] = newInstance
	}

	import(newModule: ModuleNamespace, ...args: any[]) {
		const newInstance = new newModule.default(...args);

		const name = newModule.default.name;
		this.modules[name] = newModule
  		this.instances[name] = newInstance
  		this.constructorArgs[name] = args
	}
}

export default HotModuleReloadSetup;

export function HMREventHandler(newModule: ModuleNamespace | undefined) {
	const event = new CustomEvent('hot-module-reload', { detail: { newModule } });
	document.body.dispatchEvent(event);
}