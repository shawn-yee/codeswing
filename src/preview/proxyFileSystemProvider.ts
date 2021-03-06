import * as path from "path";
import { URLSearchParams } from "url";
import * as vscode from "vscode";
import { byteArrayToString, stringToByteArray } from "../utils";
import { compileComponent } from "./languages/components/svelte";
import { processImports } from "./libraries/skypack";

export class ProxyFileSystemProvider implements vscode.FileSystemProvider {
  private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
  readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this
    ._emitter.event;

  static SCHEME = "codeswing-proxy";

  stat(uri: vscode.Uri): vscode.FileStat {
    return {
      type: vscode.FileType.File,
      ctime: 0,
      mtime: 0,
      size: 0,
    };
  }

  async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    let proxyUri = vscode.Uri.parse(decodeURIComponent(uri.path.substr(1)));
    
    const extension = path.extname(uri.path);
    if (extension === ".js") {
      let type;
      if (uri.query) {
        const query = new URLSearchParams(uri.query);
        type = query.get("type");
        proxyUri = proxyUri.with({ path: proxyUri.path.replace(".js", `.${type}`), query: "" });
      }

      let contents = byteArrayToString(await vscode.workspace.fs.readFile(proxyUri));
      if (type === "svelte") {
        [contents] = await compileComponent(contents);
      }

      return stringToByteArray(processImports(contents))
    } else {
      return vscode.workspace.fs.readFile(proxyUri);
    }
  }

  public static getProxyUri(uri: vscode.Uri) {
    return vscode.Uri.parse(
      `${ProxyFileSystemProvider.SCHEME}:/${encodeURIComponent(uri.toString())}`
    );
  }

  writeFile(
    uri: vscode.Uri,
    content: Uint8Array,
    options: { create: boolean; overwrite: boolean }
  ): void {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }

  delete(uri: vscode.Uri): void {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }

  readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }

  rename(
    oldUri: vscode.Uri,
    newUri: vscode.Uri,
    options: { overwrite: boolean }
  ): void {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }

  createDirectory(uri: vscode.Uri): void {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }

  watch(_resource: vscode.Uri): vscode.Disposable {
    throw vscode.FileSystemError.NoPermissions("Not supported");
  }
}

export function registerProxyFileSystemProvider() {
  vscode.workspace.registerFileSystemProvider(
    ProxyFileSystemProvider.SCHEME,
    new ProxyFileSystemProvider(), {
      isReadonly: true
    }
  );
}
