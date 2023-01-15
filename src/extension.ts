import * as vscode from 'vscode';


// 拡張機能を有効化したときに呼び出される
export function activate(context: vscode.ExtensionContext) {
	// コマンドを登録する
	// package.jsonのcontributes.commandsに登録したコマンド名を指定する必要がある
	context.subscriptions.push(
		vscode.commands.registerCommand('search-command.custom-search', customSearch)
	);
}

export function deactivate() { }

function loadSnippets() {
	// 設定を読み込む
	const config = vscode.workspace.getConfiguration('search-command');
	let proxy_snippets: { [key: string]: string } | undefined = config.get('snippets');
	if (!proxy_snippets) {
		// snippetsが設定されていない場合はエラーを表示する
		vscode.window.showErrorMessage('snippets is not found.');
		proxy_snippets = {};
	}
	console.log(proxy_snippets);
	return proxy_snippets;
}

function customSearch() {
	// 検索ボックスを表示する
	vscode.window.showInputBox({
		placeHolder: '検索する文字列を入力してください',
		prompt: '検索する文字列を入力してください',
		ignoreFocusOut: true,
	}).then((value) => {
		// 検索ボックスで入力された文字列を取得する
		if (value) {
			// snippetsを読み込む
			let dict_snippets = loadSnippets();
			// snippetsの中から検索する
			let result = Object.keys(dict_snippets).filter((key) => {
				return (key + dict_snippets[key]).indexOf(value) !== -1;
			}).map((key) => {
				return key + ":\t" + dict_snippets[key];
			});
			console.log("result:\n" + result.join("\n"));

			if (result.length === 0) {
				// 検索結果がない場合はエラーを表示する
				vscode.window.showErrorMessage('検索結果がありません');
				return;
			}

			// 検索結果の中から選択する
			vscode.window.showQuickPick(result).then((value) => {
				if (value) {
					// 選択された文字列をクリップボードにコピーする
					vscode.env.clipboard.writeText(value.split(":\t")[1]);
					console.log(value);
				}
			});
		}
	})
}