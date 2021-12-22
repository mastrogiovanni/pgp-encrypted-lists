import Topbar from './Topbar.svelte';
import Footer from './Footer.svelte';
import Body from './Body.svelte';

export default {
	"comp.body": new Body({
		target: document.getElementById("comp.body"),
	}),
	"comp.footer": new Footer({
		target: document.getElementById("comp.footer"),
	}),
	"comp.topbar": new Topbar({
		target: document.getElementById("comp.topbar"),
	})
};