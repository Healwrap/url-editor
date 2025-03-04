// let currentListener: (() => void) | null = null;

// function addWebRequestListener(tabId: number) {
// 	if (currentListener) {
// 		chrome.webRequest.onBeforeRequest.removeListener(currentListener);
// 	}

// 	const listener = (details: chrome.webRequest.WebRequestBodyDetails) => {
// 		console.log(details);
// 		chrome.tabs.sendMessage(
// 			tabId,
// 			{ type: "xhr", data: details },
// 			(response) => {
// 				if (chrome.runtime.lastError) {
// 					console.error("Error sending message:", chrome.runtime.lastError);
// 				} else {
// 					console.log("Response from content script:", response);
// 				}
// 			}
// 		);
// 	};

// 	chrome.webRequest.onBeforeRequest.addListener(listener, {
// 		urls: [
// 			"https://fspb.test.meituan.com/*",
// 			"https://39747-hvmbc-sl-paymp.pay.test.sankuai.com/merchant/front/common/merchant-entry-login-verify",
// 		],
// 	});

// 	currentListener = () =>
// 		chrome.webRequest.onBeforeRequest.removeListener(listener);
// }

// function updateListenerForActiveTab() {
// 	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 		if (tabs.length === 0) return;
// 		const currentTab = tabs[0];
// 		const currentUrl = new URL(currentTab.url ?? "");
// 		if (!["http:", "https:"].includes(currentUrl.protocol)) return;
// 		addWebRequestListener(currentTab.id ?? 0);
// 	});
// }

// chrome.tabs.onActivated.addListener(updateListenerForActiveTab);
// chrome.tabs.onUpdated.addListener(updateListenerForActiveTab);

// // 初始加载时添加监听
// updateListenerForActiveTab();

import browser from "webextension-polyfill"

