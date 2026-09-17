use serde_json::Value;
use std::fs;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    Manager, Runtime, WebviewUrl, WebviewWindowBuilder,
};

#[tauri::command]
async fn spawn_agent<R: Runtime>(app: tauri::AppHandle<R>, skill_id: String, name: String) {
    let window_label = format!("agent-{}", skill_id);

    if let Some(window) = app.get_webview_window(&window_label) {
        let _ = window.set_focus();
        return;
    }

    let _window = WebviewWindowBuilder::new(
        &app,
        window_label,
        WebviewUrl::App(format!("/desktop?skill={}", skill_id).into()),
    )
    .title(format!("AgentBoost Command Center: {}", name))
    .inner_size(1050.0, 800.0)
    .resizable(true)
    .always_on_top(false)
    .build()
    .unwrap();
}

#[tauri::command]
async fn export_official_document<R: Runtime>(
    _app: tauri::AppHandle<R>,
    filename: String,
    content: String,
) -> Result<String, String> {
    let downloads_dir = dirs::download_dir()
        .or_else(|| dirs::home_dir().map(|dir| dir.join("Downloads")))
        .ok_or_else(|| "Unable to resolve Downloads directory".to_string())?;

    fs::create_dir_all(&downloads_dir)
        .map_err(|e| format!("Failed to create directory: {}", e))?;

    let target_path = downloads_dir.join(filename);
    fs::write(&target_path, content)
        .map_err(|e| format!("Failed to write document: {}", e))?;

    Ok(target_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn download_desktop_agent<R: Runtime>(
    _app: tauri::AppHandle<R>,
    skill_id: String,
    name: String,
    metadata: Option<Value>,
) -> Result<String, String> {
    let downloads_dir = dirs::download_dir()
        .or_else(|| dirs::home_dir().map(|dir| dir.join("Downloads")))
        .ok_or_else(|| "Unable to resolve Downloads directory".to_string())?;

    fs::create_dir_all(&downloads_dir).map_err(|e| format!("Failed: {}", e))?;

    let safe_name = name
        .chars()
        .map(|c| match c {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '-' | '_' => c,
            _ => '-',
        })
        .collect::<String>();

    let file_name = format!("agentboost-{}-bundle.json", safe_name.to_lowercase());

    let generated_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| format!("Time error: {}", e))?
        .as_secs();

    let manifest = serde_json::json!({
        "id": skill_id,
        "name": name,
        "generatedAtUnix": generated_at,
        "desktopApp": "AgentBoost Workstation",
        "daemonPort": 8765,
        "metadata": metadata
    });

    let output_path = downloads_dir.join(file_name);
    let content = serde_json::to_string_pretty(&manifest)
        .map_err(|e| format!("Encode failure: {}", e))?;
    fs::write(&output_path, content)
        .map_err(|e| format!("Write failure: {}", e))?;

    Ok(output_path.to_string_lossy().to_string())
}

#[tauri::command]
async fn install_desktop_update<R: Runtime>(
    _app: tauri::AppHandle<R>,
    download_url: String,
) -> Result<String, String> {
    let temp_dir = std::env::temp_dir();
    let is_msi = download_url.to_lowercase().ends_with(".msi");
    let file_name = if is_msi {
        "AgentBoost_Update.msi"
    } else {
        "AgentBoost_Update.exe"
    };

    let target_file = temp_dir.join(file_name);
    let target_str = target_file.to_string_lossy().to_string();

    // 1. Download installer file directly using native curl
    let status = std::process::Command::new("curl.exe")
        .args(["-L", "-s", "-o", &target_str, &download_url])
        .status()
        .map_err(|e| format!("Failed to invoke system downloader: {}", e))?;

    if !status.success() {
        return Err("Update download failed. Please check network connection.".to_string());
    }

    // 2. Launch the downloaded installer
    if is_msi {
        std::process::Command::new("msiexec.exe")
            .args(["/i", &target_str])
            .spawn()
            .map_err(|e| format!("Failed to launch MSI installer: {}", e))?;
    } else {
        std::process::Command::new(&target_str)
            .spawn()
            .map_err(|e| format!("Failed to launch update installer: {}", e))?;
    }

    Ok("Installer launched successfully. Follow the on-screen prompts to complete setup.".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            spawn_agent,
            download_desktop_agent,
            export_official_document,
            install_desktop_update
        ])
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit AgentBoost", true, None::<&str>).unwrap();
            let show_i = MenuItem::with_id(app, "show", "Open Autonomous Bridge", true, None::<&str>).unwrap();
            let tender_i = MenuItem::with_id(app, "tenders", "Tender Command Room", true, None::<&str>).unwrap();

            let menu = Menu::with_items(app, &[&show_i, &tender_i, &quit_i]).unwrap();

            let mut tray_builder = TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "tenders" => {
                        let window_label = "tender-command-room";
                        if let Some(window) = app.get_webview_window(window_label) {
                            let _ = window.set_focus();
                        } else {
                            let _ = WebviewWindowBuilder::new(
                                app,
                                window_label,
                                WebviewUrl::App("/tenders".into()),
                            )
                            .title("AgentBoost: Tender & RFQ Command Room")
                            .inner_size(1240.0, 850.0)
                            .build();
                        }
                    }
                    _ => {}
                });

            if let Some(icon) = app.default_window_icon() {
                tray_builder = tray_builder.icon(icon.clone());
            }

            let _tray = tray_builder.build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}