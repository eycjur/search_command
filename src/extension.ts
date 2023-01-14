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
	const snippets = config.get<{ [key: string]: string }>('snippets');
	if (!snippets) {
		// snippetsが設定されていない場合はエラーを表示する
		vscode.window.showErrorMessage('snippets is not found.');
		return {};
	}
	console.log("snippets: " + snippets);
	return snippets;
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
				return key.indexOf(value) !== -1;
			}).map((key) => {
				return key + ": " + dict_snippets[key];
			});
			console.log("result: " + result);

			// 検索結果の中から選択する
			vscode.window.showQuickPick(result).then((value) => {
				if (value) {
					// 選択された文字列をクリップボードにコピーする
					vscode.env.clipboard.writeText(value);
				}
			});
		}
	})
}