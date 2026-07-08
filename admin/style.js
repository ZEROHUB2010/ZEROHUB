/* 🎨 ТАҒЙИРЁБАНДАҲОИ АСОСИИ РАНГ (ҲАР ВАҚТ ХОҲӢ, ТАНҲО ҲАМИН ҶОРО ИВАЗ КУН) */
:root { 
    --bg-color: #0f172a; 
    --card-bg: #1e293b; 
    --neon-green: #00ff66; /* Сабзи неонӣ */
    --text-main: #ffffff; 
    --text-muted: #94a3b8; 
    --danger: #ff4444; 
}

* { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
    font-family: -apple-system, sans-serif; 
}

body { 
    background-color: var(--bg-color); 
    color: var(--text-main); 
    padding: 20px; 
}

#login-screen { 
    max-width: 400px; 
    margin: 100px auto; 
    background: var(--card-bg); 
    padding: 30px; 
    border-radius: 20px; 
    text-align: center; 
    border: 1px solid #334155; 
}

#login-screen h2 { 
    color: var(--neon-green); 
    margin-bottom: 20px; 
}

.login-input { 
    width: 100%; 
    background: var(--bg-color); 
    border: 1px solid #334155; 
    color: white; 
    padding: 12px; 
    border-radius: 10px; 
    margin-bottom: 20px; 
    outline: none; 
    text-align: center; 
    font-size: 16px; 
}

.login-input:focus { 
    border-color: var(--neon-green); 
}

.login-btn { 
    background: var(--neon-green); 
    color: var(--bg-color); 
    border: none; 
    padding: 12px; 
    border-radius: 10px; 
    width: 100%; 
    font-weight: bold; 
    font-size: 16px; 
    cursor: pointer; 
}

#admin-panel { 
    display: none; 
    max-width: 600px; 
    margin: 0 auto; 
}

.admin-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 30px; 
    border-bottom: 1px solid #334155; 
    padding-bottom: 15px; 
}

.admin-header h1 { 
    color: var(--neon-green); 
    font-size: 22px; 
}

.logout-btn { 
    background: transparent; 
    border: 1px solid var(--danger); 
    color: var(--danger); 
    padding: 6px 12px; 
    border-radius: 8px; 
    cursor: pointer; 
}

.stats-grid { 
    display: grid; 
    grid-template-columns: repeat(3, 1fr); 
    gap: 15px; 
    margin-bottom: 30px; 
}

.stat-card { 
    background: var(--card-bg); 
    padding: 15px; 
    border-radius: 12px; 
    text-align: center; 
}

.stat-card i { 
    font-size: 20px; 
    color: var(--neon-green); 
    margin-bottom: 8px; 
}

.stat-card h3 { 
    font-size: 22px; 
    margin-bottom: 5px; 
}

.stat-card p { 
    font-size: 12px; 
    color: var(--text-muted); 
}

.form-container { 
    background: var(--card-bg); 
    padding: 25px; 
    border-radius: 20px; 
    margin-bottom: 20px; 
}

.form-container h2 { 
    font-size: 18px; 
    margin-bottom: 20px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
}

.form-container h2 i { 
    color: var(--neon-green); 
}

.form-group { 
    margin-bottom: 15px; 
}

.form-group label { 
    display: block; 
    font-size: 13px; 
    color: var(--text-muted); 
    margin-bottom: 5px; 
}

.form-control { 
    width: 100%; 
    background: var(--bg-color); 
    border: 1px solid #334155; 
    color: white; 
    padding: 12px; 
    border-radius: 10px; 
    outline: none; 
    font-size: 14px; 
}

.form-control:focus { 
    border-color: var(--neon-green); 
}

.form-control:readonly { 
    background: #0f172a; 
    color: var(--neon-green); 
    font-weight: bold; 
    border-style: dashed; 
}

.checkbox-group { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    margin: 20px 0; 
}

.checkbox-group input { 
    width: 18px; 
    height: 18px; 
    accent-color: var(--neon-green); 
}

.submit-btn { 
    background: var(--neon-green); 
    color: var(--bg-color); 
    border: none; 
    padding: 14px; 
    border-radius: 10px; 
    width: 100%; 
    font-weight: bold; 
    font-size: 16px; 
    cursor: pointer; 
}

.app-item { 
    background: var(--bg-color); 
    border: 1px solid #334155; 
    padding: 12px 15px; 
    border-radius: 10px; 
    margin-bottom: 10px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
}

.app-item strong { 
    color: white; 
    display: block; 
    font-size: 15px; 
}

.app-item span { 
    color: var(--text-muted); 
    font-size: 12px; 
}

.delete-btn { 
    background: var(--danger); 
    color: white; 
    border: none; 
    padding: 8px 12px; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 13px; 
}
