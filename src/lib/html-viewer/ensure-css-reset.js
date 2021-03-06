import normalize from '!!raw-loader!normalize.css/normalize.css';

const CSS_RESET = `
	a, a:hover, a:active { color: blue; text-decoration: underline; cursor: pointer; }
	a:visited { color: purple; }
`;

let cssReset, cssResetId;
export default function ensureCssReset() {
	if (cssResetId) return cssResetId;
	cssResetId = 'e'+Math.random().toString(36).substring(2);

	// create a sandboxed stylesheet in an isolated DOM so it doesn't cause a massive relayout
	let doc = new DOMParser().parseFromString('<!DOCTYPE html><html><body></body></html>', 'text/html');
	let style = doc.createElement('style');
	style.appendChild(doc.createTextNode(CSS_RESET+normalize));
	doc.body.appendChild(style);

	let rules = style.sheet.cssRules;
	let scope = `[data-css-reset="${cssResetId}"]`;
	let sheet = '';
	let scopeSelector = sel => /^\s*(html|body)\s*$/g.test(sel) ? scope : `${scope} ${sel}`;
	for (let i=0; rules && i<rules.length; i++) {
		let rule = rules[i];
		if (rule.type===1) {
			let sel = rule.selectorText.split(/\s*,\s*/).map(scopeSelector).join(', ');
			sheet += `\n${sel}{${rule.style.cssText}}`;
		}
	}

	// create & append the actual stylesheet
	cssReset = document.createElement('style');
	cssReset.id = 'html-viewer-css-reset';
	cssReset.media = 'NOT tty';
	cssReset.appendChild(document.createTextNode(sheet));
	document.getElementsByTagName('head')[0].appendChild(cssReset);

	return cssResetId;
}
