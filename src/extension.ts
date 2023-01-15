import * as vscode from 'vscode';


// 拡張機能を有効化したときに呼び出される
export function activate(context: vscode.ExtensionContext) {
	// コマンドを登録する
	// package.jsonのcontributes.commandsに登録したコマンド名を指定する必要がある
	context.subscriptions.push(
		vscode.commands.registerCommand('my-search-command.search', search)
	);
}

export function deactivate() { }

function loadSnippets() {
	// 設定を読み込む
	const config = vscode.workspace.getConfiguration('my-search-command');
	let proxy_snippets: { [key: string]: string } | undefined = config.get('snippets');
	if (!proxy_snippets) {
		// snippetsが設定されていない場合はエラーを表示する
		vscode.window.showErrorMessage('snippets is not found.');
		proxy_snippets = {};
	}
	console.log(proxy_snippets);
	return proxy_snippets;
}

async function search() {
	let dict_snippets = loadSnippets();
	let items: vscode.QuickPickItem[] = Object.keys(dict_snippets).map((key) => {
		return {
			label: key,
			description: dict_snippets[key],
			alwaysShow: true,
		}
	});

	// 検索ボックスを表示する（インクリメンタルサーチ）
	let result = await vscode.window.showQuickPick(items, {
		placeHolder: '検索する文字列を入力してください',
		ignoreFocusOut: true,
	})
	if (result) {
		// 選択された文字列をクリップボードにコピーする
		vscode.env.clipboard.writeText(result.label);
		console.log(result);
	} else {
		vscode.window.showErrorMessage('キャンセルされました');
	}
}