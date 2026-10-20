/* ============================================================
   APP PAY ADMIN - Styles
   ============================================================ */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
    background-color: #f0f2f5;
    color: #333;
    min-height: 100vh;
    zoom: 0.6;
}

/* ============================================================
   ÉCRANS D'AUTHENTIFICATION
   ============================================================ */
.auth-screen {
    display: none;
    min-height: 100vh;
    padding: 20px;
}

.auth-screen.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ============================================================
   ÉCRAN DE CHARGEMENT
   ============================================================ */
#admin-loading-screen {
    background: linear-gradient(135deg, #ff7a00 0%, #ff9533 100%);
}

.auth-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    animation: authFadeIn 0.4s ease;
}

.auth-loading-logo {
    width: 90px;
    height: 90px;
    border-radius: 24px;
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 42px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    animation: loadingPulse 1.8s ease-in-out infinite;
}

.auth-loading-title {
    font-size: 28px;
    font-weight: 800;
    color: white;
    letter-spacing: 3px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.auth-loading-spinner {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner-circle {
    width: 44px;
    height: 44px;
    border: 4px solid rgba(255, 255, 255, 0.25);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spinnerRotate 0.9s linear infinite;
}

.auth-loading-text {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    letter-spacing: 0.5px;
    animation: loadingBlink 1.5s ease-in-out infinite;
}

@keyframes spinnerRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes loadingPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes loadingBlink {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

@keyframes authFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ============================================================
   CARTES D'AUTHENTIFICATION
   ============================================================ */
.auth-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    width: 100%;
    max-width: 460px;
    padding: 40px 35px;
    animation: authFadeInUp 0.4s ease;
}

.auth-logo {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 25px;
    justify-content: center;
}

.auth-logo i {
    font-size: 38px;
    color: #ff7a00;
}

.auth-logo h1 {
    font-size: 24px;
    font-weight: 800;
    color: #111;
    letter-spacing: 1px;
}

.auth-logo p {
    font-size: 12px;
    color: #888;
    margin-top: 2px;
}

.auth-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #fff5eb;
    color: #ff7a00;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 20px;
    margin: 0 auto 25px auto;
    border: 1px solid #ffe4cc;
    width: fit-content;
}

.auth-badge.register {
    background-color: #e8f0fe;
    color: #1a73e8;
    border-color: #c5d8f5;
}

.auth-badge i {
    font-size: 12px;
}

.auth-title {
    font-size: 22px;
    font-weight: 700;
    color: #111;
    text-align: center;
    margin-bottom: 8px;
}

.auth-subtitle {
    font-size: 13px;
    color: #888;
    text-align: center;
    margin-bottom: 25px;
    line-height: 1.5;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
}

.auth-input-group {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border: 2px solid #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
}

.auth-input-group:focus-within {
    background-color: #ffffff;
    border-color: #ff7a00;
    box-shadow: 0 0 0 4px rgba(255, 122, 0, 0.1);
}

.auth-input-icon {
    width: 50px;
    height: 50px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 15px;
    flex-shrink: 0;
    border-right: 1px solid #f0f0f0;
    transition: color 0.2s;
}

.auth-input-group:focus-within .auth-input-icon {
    color: #ff7a00;
}

.auth-input-group input {
    flex: 1;
    border: none;
    outline: none;
    padding: 15px 18px;
    font-size: 14px;
    color: #111;
    background: transparent;
    min-width: 0;
    font-weight: 500;
}

.auth-input-group input::placeholder {
    color: #aaa;
    font-weight: 400;
}

.auth-error {
    color: #e02424;
    font-size: 12px;
    text-align: center;
    min-height: 16px;
    font-weight: 500;
    line-height: 1.4;
    padding: 0 10px;
}

.auth-btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #ff7a00 0%, #ff9533 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 15px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 8px 20px rgba(255, 122, 0, 0.25);
    letter-spacing: 0.3px;
}

.auth-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(255, 122, 0, 0.35);
}

.auth-btn-primary:active {
    transform: translateY(0);
}

.auth-btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.auth-btn-secondary {
    width: 100%;
    background-color: #ffffff;
    color: #333;
    border: 2px solid #e8eaee;
    border-radius: 12px;
    padding: 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.auth-btn-secondary:hover {
    border-color: #ff7a00;
    color: #ff7a00;
    background-color: #fff8f2;
}

.auth-divider {
    text-align: center;
    margin: 20px 0;
    position: relative;
}

.auth-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e8eaee;
}

.auth-divider span {
    position: relative;
    background-color: white;
    padding: 0 15px;
    color: #999;
    font-size: 12px;
}

@keyframes authFadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   PANNEAU ADMIN - PLEIN ÉCRAN
   ============================================================ */
#admin-panel-screen {
    padding: 0;
    align-items: flex-start;
}

#admin-panel-screen.active {
    align-items: flex-start;
}

.admin-container {
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    padding: 15px;
}

/* En-tête admin */
.admin-header {
    background: linear-gradient(135deg, #ff7a00 0%, #ff9533 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 12px;
    margin-bottom: 25px;
    box-shadow: 0 8px 24px rgba(255, 122, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
}

.admin-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.admin-logo i {
    font-size: 32px;
}

.admin-logo h1 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.admin-logo p {
    font-size: 12px;
    opacity: 0.9;
    margin-top: 2px;
}

.badge-admin {
    background: rgba(255, 255, 255, 0.25);
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 600;
    letter-spacing: 1.5px;
}

.admin-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.admin-user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.15);
    padding: 8px 14px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.admin-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.4);
}

.admin-user-name {
    font-size: 13px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
}

.admin-user-email {
    font-size: 10px;
    opacity: 0.85;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
}

.admin-logout-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.admin-logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

/* Sections */
.form-section, .clients-section {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    margin-bottom: 25px;
}

.modify-section {
    border-top: 3px solid #1a73e8;
}

.modify-section .section-badge {
    background-color: #e8f0fe;
    border-color: #c5d8f5;
}

.modify-section .section-badge i {
    color: #1a73e8;
}

.section-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #f1f2f5;
    color: #333;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 25px;
    border: 1px solid #e4e6eb;
}

.section-badge i {
    color: #ff7a00;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #222;
    margin-bottom: 18px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-title:first-of-type {
    margin-top: 0;
}

.section-title i {
    color: #ff7a00;
    font-size: 15px;
}

/* Formulaire */
.form-group {
    margin-bottom: 20px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-group label {
    display: block;
    font-size: 13px;
    color: #555;
    margin-bottom: 6px;
    font-weight: 500;
}

.required {
    color: #e02424;
    font-weight: 600;
}

.optional {
    color: #909399;
    font-weight: 400;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 14px;
    color: #333;
    outline: none;
    background-color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
}

.form-group textarea {
    resize: vertical;
    min-height: 70px;
    line-height: 1.4;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #ff7a00;
    box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.modify-section .form-group input:focus,
.modify-section .form-group select:focus,
.modify-section .form-group textarea:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.form-group small {
    display: block;
    font-size: 11px;
    color: #909399;
    margin-top: 5px;
    line-height: 1.4;
}

/* Champ pourcentage */
.percentage-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f8f9fa;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 8px 14px;
}

.percentage-row:focus-within {
    border-color: #ff7a00;
    box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.percentage-label {
    font-size: 14px;
    color: #555;
    font-weight: 500;
    white-space: nowrap;
}

.percentage-row input {
    flex: 1;
    border: none;
    outline: none;
    padding: 6px 8px;
    font-size: 15px;
    font-weight: 600;
    color: #ff7a00;
    background: transparent;
    text-align: center;
    max-width: 80px;
}

/* Input avec addon */
.input-with-addon {
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    transition: border-color 0.2s;
}

.input-with-addon:focus-within {
    border-color: #ff7a00;
    box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.input-with-addon input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 14px;
    font-size: 15px;
    color: #333;
    background: transparent;
    min-width: 0;
}

.input-addon {
    padding: 0 15px;
    font-weight: 600;
    color: #444;
    background-color: #f8f9fa;
    font-size: 14px;
    flex-shrink: 0;
}

/* Sélecteur de couleurs */
.color-picker {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 8px;
    padding: 12px;
    background-color: #f8f9fa;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
}

.color-option {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
    position: relative;
}

.color-option:hover {
    transform: scale(1.12);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-option.selected {
    border-color: #111;
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.color-option.selected::after {
    content: '\f00c';
    font-family: 'Font Awesome 6 Free';
    font-weight: 900;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Boutons */
.btn-create,
.btn-save-changes {
    width: 100%;
    background-color: #ff7a00;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: background 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-create:hover {
    background-color: #e66d00;
}
.btn-create:active {
    transform: scale(0.99);
}
.btn-create:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Boutons d'accès */
.access-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.btn-access {
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    background-color: #fff;
}

.btn-block {
    border-color: #f5c6cb;
    color: #e02424;
}

.btn-block:hover {
    background-color: #fff5f5;
}

.btn-unblock {
    border-color: #c3e6cb;
    color: #03543f;
}

.btn-unblock:hover {
    background-color: #f0fdf4;
}

/* Historique modifier */
.m-tx-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
    min-height: 60px;
}

.m-tx-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 10px 14px;
    border-radius: 6px;
    border-left: 3px solid #ff7a00;
    font-size: 13px;
    gap: 10px;
}

.m-tx-item.credit {
    border-left-color: #00c853;
}

.m-tx-item.debit {
    border-left-color: #e02424;
}

.m-tx-item-info {
    flex: 1;
    min-width: 0;
}

.m-tx-item-title {
    font-weight: 600;
    color: #222;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.m-tx-item-date {
    font-size: 11px;
    color: #888;
}

.m-tx-item-amount {
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
}

.m-tx-item-amount.credit {
    color: #03543f;
}

.m-tx-item-amount.debit {
    color: #e02424;
}

.m-tx-item-delete {
    background: transparent;
    border: none;
    color: #e02424;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 4px;
    font-size: 12px;
    transition: background 0.15s;
}

.m-tx-item-delete:hover {
    background-color: #fff5f5;
}

.m-tx-logo-box {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #e8eaee;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 3px;
    flex-shrink: 0;
}

.m-tx-logo-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.m-tx-logo-box.fallback {
    background: #fff5eb;
    color: #ff7a00;
    font-size: 14px;
    padding: 0;
}

.hidden {
    display: none !important;
}

/* ============================================================
   MENU DÉROULANT PERSONNALISÉ (custom-select)
   ============================================================ */
.custom-select {
    position: relative;
    width: 100%;
    user-select: none;
}

.custom-select-trigger {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    text-align: left;
    gap: 12px;
    font-family: inherit;
    outline: none;
}

.custom-select-trigger:hover {
    border-color: #b0b5be;
}

.custom-select.open .custom-select-trigger {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

.custom-select-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: #e8f0fe;
    color: #1a73e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: background-color 0.2s, color 0.2s;
}

.custom-select-text {
    flex: 1;
    font-size: 14px;
    color: #333;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
}

.custom-select-text.placeholder {
    color: #909399;
    font-weight: 400;
}

.custom-select-arrow {
    color: #909399;
    font-size: 12px;
    flex-shrink: 0;
    transition: transform 0.2s;
}

.custom-select.open .custom-select-arrow {
    transform: rotate(180deg);
}

.custom-select-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #e8eaee;
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    max-height: 340px;
    overflow-y: auto;
    z-index: 100;
    display: none;
    animation: dropdownFadeIn 0.15s ease;
    padding: 6px;
}

.custom-select.open .custom-select-dropdown {
    display: block;
}

.custom-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s;
    font-size: 14px;
    color: #333;
}

.custom-option:hover {
    background-color: #f5f7fb;
}

.custom-option.selected {
    background-color: #e8f0fe;
    color: #1a73e8;
    font-weight: 600;
}

.custom-option i {
    width: 20px;
    text-align: center;
    color: #1a73e8;
    font-size: 14px;
    flex-shrink: 0;
}

.custom-option.selected i {
    color: #1a73e8;
}

.custom-option span {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   CARTE D'OPTION DYNAMIQUE
   ============================================================ */
#option-card-container {
    margin-top: 25px;
}

.option-card {
    background-color: #f8f9fc;
    border: 1px solid #e8eaee;
    border-left: 4px solid #1a73e8;
    border-radius: 10px;
    padding: 25px;
    animation: fadeInUp 0.3s ease;
}

.option-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e8eaee;
}

.option-card-header-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background-color: #e8f0fe;
    color: #1a73e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.option-card-header-title {
    font-size: 16px;
    font-weight: 700;
    color: #111;
}

.option-card-header-subtitle {
    font-size: 12px;
    color: #888;
    margin-top: 2px;
}

.option-card-body {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.option-card-body .form-group {
    margin-bottom: 0;
}

.option-card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid #e8eaee;
}

.option-card-actions button {
    padding: 11px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}

.option-card-actions .btn-option-save {
    background-color: #1a73e8;
    color: white;
}

.option-card-actions .btn-option-save:hover {
    background-color: #1557b0;
}

.option-card-actions .btn-option-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.option-card-actions .btn-option-cancel {
    background-color: #f0f2f5;
    color: #333;
}

.option-card-actions .btn-option-cancel:hover {
    background-color: #e4e6eb;
}

.option-info-box {
    background-color: #f0f7ff;
    border: 1px solid #c5d8f5;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 12px;
    color: #1a73e8;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.5;
}

.option-status-box {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.option-status-box-label {
    font-size: 13px;
    color: #666;
    font-weight: 500;
}

.option-status-box-value {
    font-size: 13px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
}

.option-status-box-value.active {
    background-color: #def7ec;
    color: #03543f;
}

.option-status-box-value.blocked {
    background-color: #fde8e8;
    color: #e02424;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   LISTE DES CLIENTS
   ============================================================ */
.section-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
    flex-wrap: wrap;
}

.count-badge {
    display: inline-block;
    background-color: #ff7a00;
    color: white;
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 10px;
    margin-left: 6px;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
}

.btn-clear {
    background: #fff;
    border: 1px solid #f5c6cb;
    color: #e02424;
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.2s;
}
.btn-clear:hover {
    background-color: #fff5f5;
}

.clients-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.empty-state {
    text-align: center;
    color: #999;
    font-size: 13px;
    padding: 40px 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;
}

.client-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 16px 18px;
    border: 1px solid #e8eaee;
    border-radius: 10px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.client-row:hover {
    border-color: #ff7a00;
    box-shadow: 0 6px 18px rgba(255, 122, 0, 0.1);
    transform: translateY(-1px);
}

.client-row.blocked {
    border-left: 4px solid #e02424;
}

.client-row-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    flex: 1;
}

.client-row-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff7a00 0%, #ffaa5c 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    flex-shrink: 0;
    letter-spacing: 0.5px;
}

.client-row-info {
    min-width: 0;
    flex: 1;
}

.client-row-name {
    font-size: 14px;
    font-weight: 700;
    color: #111;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.client-row-email {
    font-size: 12px;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.client-row-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.client-row-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 20px;
    letter-spacing: 0.3px;
    flex-shrink: 0;
}

.client-row-status.active {
    background-color: #def7ec;
    color: #03543f;
}

.client-row-status.blocked {
    background-color: #fde8e8;
    color: #e02424;
}

.client-row-status i {
    font-size: 10px;
}

.client-row-delete {
    background-color: #fff;
    border: 1px solid #f5c6cb;
    color: #e02424;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.client-row-delete:hover {
    background-color: #e02424;
    color: white;
    border-color: #e02424;
    transform: scale(1.05);
}

.client-row-delete:active {
    transform: scale(0.95);
}

.client-row-arrow {
    color: #c0c4cc;
    font-size: 14px;
    flex-shrink: 0;
    transition: transform 0.2s;
}

.client-row:hover .client-row-arrow {
    color: #ff7a00;
    transform: translateX(3px);
}

/* ============================================================
   MODAL DÉTAILS CLIENT
   ============================================================ */
.modal-client-card {
    max-width: 600px;
    padding: 0;
    text-align: left;
    position: relative;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 10;
    transition: background 0.2s, color 0.2s;
}

.modal-close-btn:hover {
    background-color: #fff;
    color: #e02424;
}

.client-detail-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 25px 30px;
    background: linear-gradient(135deg, #ff7a00 0%, #ff9533 100%);
    color: white;
    position: relative;
    flex-shrink: 0;
    padding-right: 60px;
}

.client-detail-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.25);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 20px;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.4);
}

.client-detail-header > div:nth-child(2) {
    flex: 1;
    min-width: 0;
}

.client-detail-name {
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.client-detail-meta {
    font-size: 12px;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.client-detail-status {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    background-color: rgba(255, 255, 255, 0.25);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.4);
    flex-shrink: 0;
}

.client-detail-status.active {
    background-color: rgba(255, 255, 255, 0.95);
    color: #03543f;
}

.client-detail-status.blocked {
    background-color: rgba(255, 255, 255, 0.95);
    color: #e02424;
}

.client-detail-body {
    padding: 25px 30px;
    overflow-y: auto;
    flex: 1;
}

.cd-section {
    margin-bottom: 22px;
}

.cd-section:last-child {
    margin-bottom: 0;
}

.cd-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #ff7a00;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
}

.cd-section-title i {
    font-size: 12px;
}

.cd-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 9px 0;
    font-size: 13px;
    border-bottom: 1px solid #f8f8f8;
}

.cd-row:last-child {
    border-bottom: none;
}

.cd-label {
    color: #888;
    font-weight: 500;
    flex-shrink: 0;
}

.cd-value {
    color: #111;
    font-weight: 600;
    text-align: right;
    word-break: break-word;
    min-width: 0;
}

.cd-value-copy {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #111;
    font-weight: 600;
    text-align: right;
    min-width: 0;
}

.cd-value-copy span {
    word-break: break-all;
    text-align: right;
}

.cd-code {
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    background-color: #f8f9fa;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    color: #111;
    font-weight: 700;
}

.copy-btn {
    background-color: #f0f2f5;
    border: none;
    color: #555;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.copy-btn:hover {
    background-color: #ff7a00;
    color: white;
}

.copy-btn.copied {
    background-color: #00c853;
    color: white;
}

.copy-btn-primary {
    width: auto;
    padding: 0 16px;
    height: 38px;
    gap: 6px;
    background-color: #ff7a00;
    color: white;
    font-weight: 600;
    font-size: 13px;
}

.copy-btn-primary:hover {
    background-color: #e66d00;
}

.cd-link-box {
    display: flex;
    gap: 8px;
    background-color: #f8f9fa;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #e8eaee;
    align-items: center;
}

.cd-link-box input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 8px 10px;
    font-size: 11px;
    color: #333;
    font-family: 'Courier New', monospace;
    min-width: 0;
}

.cd-hint {
    display: block;
    font-size: 11px;
    color: #909399;
    margin-top: 8px;
    line-height: 1.4;
}

.client-detail-footer {
    display: flex;
    gap: 10px;
    padding: 18px 30px;
    border-top: 1px solid #f0f0f0;
    background-color: #fafbfc;
    flex-shrink: 0;
}

.client-detail-footer button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* ============================================================
   BOUTONS D'ENVOI D'EMAIL
   ============================================================ */
.email-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 15px 0;
}

.email-action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
    border: 2px solid;
    background: #fff;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-family: inherit;
    min-width: 0;
}

.email-action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.email-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.email-action-blue {
    border-color: #c5d8f5;
    color: #1a73e8;
}

.email-action-blue:hover:not(:disabled) {
    background-color: #e8f0fe;
}

.email-action-green {
    border-color: #c3e6cb;
    color: #03543f;
}

.email-action-green:hover:not(:disabled) {
    background-color: #def7ec;
}

.email-action-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.email-action-blue .email-action-icon {
    background-color: #e8f0fe;
}

.email-action-green .email-action-icon {
    background-color: #def7ec;
}

.email-action-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.email-action-text strong {
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.email-action-text small {
    font-size: 11px;
    opacity: 0.75;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ============================================================
   MODAL GÉNÉRIQUE
   ============================================================ */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    animation: fadeIn 0.2s ease;
}

.modal-overlay.show {
    display: flex;
}

.modal-card {
    background: white;
    border-radius: 12px;
    padding: 35px 30px;
    max-width: 520px;
    width: 100%;
    text-align: center;
    animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-icon-success {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #def7ec;
    color: #03543f;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px auto;
    font-size: 32px;
}

.modal-card h2 {
    font-size: 19px;
    font-weight: 700;
    color: #111;
    margin-bottom: 10px;
}

.modal-card p {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 22px;
}

.link-box {
    display: flex;
    gap: 8px;
    margin-bottom: 22px;
}

.link-box input {
    flex: 1;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 12px 14px;
    font-size: 12px;
    color: #333;
    background: #f8f9fa;
    font-family: 'Courier New', monospace;
    outline: none;
    min-width: 0;
}

.link-box button {
    background-color: #ff7a00;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: background 0.2s;
}

.link-box button:hover {
    background-color: #e66d00;
}

.modal-actions {
    display: flex;
    gap: 10px;
}

.modal-actions button {
    flex: 1;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-primary {
    background-color: #ff7a00;
    color: white;
}
.btn-primary:hover {
    background-color: #e66d00;
}

.btn-secondary {
    background-color: #f1f2f5;
    color: #333;
}
.btn-secondary:hover {
    background-color: #e4e6eb;
}

/* ============================================================
   Animations
   ============================================================ */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

/* ============================================================
   NOUVELLE MODALE DE CONFIRMATION
   ============================================================ */
.confirm-card {
    max-width: 400px;
    padding: 35px 25px;
    text-align: center;
}

.confirm-icon-wrapper {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background-color: #fef2f2;
    color: #e02424;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 20px auto;
    border: 4px solid #fee2e2;
}

.confirm-title {
    font-size: 20px;
    font-weight: 800;
    color: #111;
    margin-bottom: 12px;
}

.confirm-message {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 25px;
    white-space: pre-line;
}

.btn-danger {
    background-color: #e02424;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.btn-danger:hover {
    background-color: #c81e1e;
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 640px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    .color-picker {
        grid-template-columns: repeat(5, 1fr);
    }
    .percentage-row {
        flex-wrap: wrap;
    }
    .percentage-row input {
        max-width: 100%;
    }
    .access-buttons {
        grid-template-columns: 1fr;
    }
    .client-detail-header {
        padding: 20px;
        padding-right: 55px;
    }
    .client-detail-avatar {
        width: 50px;
        height: 50px;
        font-size: 17px;
    }
    .client-detail-name {
        font-size: 16px;
    }
    .client-detail-body {
        padding: 20px;
    }
    .client-detail-footer {
        padding: 15px 20px;
        flex-direction: column;
    }
    .cd-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    .cd-value, .cd-value-copy {
        text-align: left;
        width: 100%;
        justify-content: flex-start;
    }
    .cd-value-copy span {
        text-align: left;
    }
    .option-card {
        padding: 18px;
    }
    .option-card-actions {
        flex-direction: column;
    }
    .option-card-actions button {
        width: 100%;
        justify-content: center;
    }
    .admin-header {
        flex-direction: column;
        align-items: stretch;
    }
    .admin-header-right {
        justify-content: space-between;
    }
    .admin-user-name,
    .admin-user-email {
        max-width: 100px;
    }
    .email-actions-grid {
        grid-template-columns: 1fr;
    }
}
// ============================================================
// GÉNÉRATION DES CARTES D'OPTIONS
// ============================================================
function renderOptionCard(option, client) {
    const container = document.getElementById('option-card-container');

    let headerIcon = '';
    let headerTitle = '';
    let headerSubtitle = '';
    let bodyHtml = '';

    switch (option) {

        case 'info':
            headerIcon = 'fa-user';
            headerTitle = 'Informations personnelles';
            headerSubtitle = 'Nom, prénom, pays et adresse du client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" id="opt-lastname" value="${escapeHtml(client.lastName)}" placeholder="Nom de famille">
                    </div>
                    <div class="form-group">
                        <label>Prénom(s)</label>
                        <input type="text" id="opt-firstname" value="${escapeHtml(client.firstName)}" placeholder="Prénom(s)">
                    </div>
                </div>
                <div class="form-group">
                    <label>Pays de résidence</label>
                    <select id="opt-country">
                        <option value="">-- Sélectionner un pays --</option>
                        ${buildCountryOptions(client.country)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Adresse de résidence</label>
                    <input type="text" id="opt-address" value="${escapeHtml(client.address || '')}" placeholder="Adresse complète">
                </div>
            `;
            break;

        case 'contact':
            headerIcon = 'fa-envelope';
            headerTitle = 'Coordonnées';
            headerSubtitle = 'Adresse e-mail et numéro de téléphone';
            bodyHtml = `
                <div class="form-group">
                    <label>Adresse e-mail</label>
                    <input type="email" id="opt-email" value="${escapeHtml(client.email || '')}" placeholder="client@gmail.com">
                </div>
                <div class="form-group">
                    <label>Numéro de téléphone</label>
                    <input type="tel" id="opt-phone" value="${escapeHtml(client.phone || '')}" placeholder="+229 01 23 45 67 89">
                </div>
            `;
            break;

        case 'account':
            headerIcon = 'fa-wallet';
            headerTitle = 'Compte bancaire';
            headerSubtitle = 'Solde, devise et langue d\'affichage';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Solde actuel</label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-balance" step="0.01" min="0" value="${Number(client.balance || 0).toFixed(2)}">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Devise</label>
                        <select id="opt-currency">${buildCurrencyOptions(client.currency)}</select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Langue d'affichage</label>
                    <select id="opt-language">${buildLanguageOptions(client.language)}</select>
                </div>
            `;
            break;

        case 'bank':
            headerIcon = 'fa-building-columns';
            headerTitle = 'Banque du client';
            headerSubtitle = 'Modifier la banque affichée dans l\'historique';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Le logo et le nom de cette banque seront utilisés pour les nouveaux virements.</span>
                </div>
                <div class="form-group">
                    <label>Banque actuelle</label>
                    <select id="opt-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
            `;
            break;

        case 'security':
            headerIcon = 'fa-shield-halved';
            headerTitle = 'Sécurité du compte';
            headerSubtitle = 'Code PIN de connexion et code d\'activation';
            bodyHtml = `
                <div class="form-group">
                    <label>Code PIN de connexion</label>
                    <input type="text" id="opt-pin" minlength="4" maxlength="8" pattern="[0-9]+" value="${escapeHtml(client.pin || '')}" placeholder="4 à 8 chiffres">
                    <small>Le client utilisera ce code pour se connecter.</small>
                </div>
                <div class="form-group">
                    <label>Code d'activation virement</label>
                    <input type="text" id="opt-activation" minlength="4" maxlength="20" value="${escapeHtml(client.activationCode || '')}" placeholder="Ex: ACT-8899">
                    <small>Le client utilisera ce code pour valider ses virements.</small>
                </div>
            `;
            break;

        case 'card_info':
            headerIcon = 'fa-credit-card';
            headerTitle = 'Carte virtuelle';
            headerSubtitle = 'Modifier la carte et gérer les autorisations';
            const isAuthorized = client.canViewCardDetails === true;
            bodyHtml = `
                <div class="form-group" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e8eaee; margin-bottom: 20px;">
                    <label style="display: block; font-weight: 700; color: #111; font-size: 13px; margin-bottom: 12px;">Visibilité des 4 derniers chiffres & CVV</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="radio-hidden-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${!isAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${!isAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="card-visibility" value="hidden" ${!isAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${!isAuthorized ? '#1a73e8' : '#555'};">Masqué</span>
                        </label>
                        <label id="radio-shown-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${isAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${isAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="card-visibility" value="shown" ${isAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${isAuthorized ? '#1a73e8' : '#555'};">Affiché</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
                        <label style="margin-bottom:0;">Numéro de carte</label>
                        <button type="button" class="copy-btn" onclick="toggleEditCardVisibility()" style="background:transparent; border:none; cursor:pointer; color:#ff7a00; padding: 0;">
                            <i class="fa-regular fa-eye" id="edit-eye-icon" style="font-size: 16px;"></i>
                        </button>
                    </div>
                    <input type="password" id="opt-card-number" value="${escapeHtml(client.cardNumber || '')}" placeholder="16 chiffres">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Date d'expiration</label>
                        <input type="text" id="opt-card-expiry" value="${escapeHtml(client.cardExpiry || '')}" placeholder="MM/AA">
                    </div>
                    <div class="form-group">
                        <label>Code CVV</label>
                        <input type="password" id="opt-card-cvv" value="${escapeHtml(client.cardCVV || '')}" placeholder="3 chiffres">
                    </div>
                </div>
            `;
            break;

        // 🆕 OPTION IBAN & SWIFT
        case 'iban_info':
            headerIcon = 'fa-building-columns';
            headerTitle = 'IBAN & SWIFT';
            headerSubtitle = 'Modifier l\'IBAN et gérer la visibilité';
            const isIbanAuthorized = client.canViewIban === true;
            bodyHtml = `
                <div class="form-group" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e8eaee; margin-bottom: 20px;">
                    <label style="display: block; font-weight: 700; color: #111; font-size: 13px; margin-bottom: 12px;">Visibilité du numéro IBAN</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="radio-iban-hidden-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${!isIbanAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${!isIbanAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="iban-visibility" value="hidden" ${!isIbanAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${!isIbanAuthorized ? '#1a73e8' : '#555'};">Masqué</span>
                        </label>
                        <label id="radio-iban-shown-label" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px; border: 2px solid ${isIbanAuthorized ? '#1a73e8' : '#dcdfe6'}; background: ${isIbanAuthorized ? '#e8f0fe' : '#fff'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                            <input type="radio" name="iban-visibility" value="shown" ${isIbanAuthorized ? 'checked' : ''} style="margin-right: 8px; cursor: pointer;">
                            <span style="font-weight: 600; color: ${isIbanAuthorized ? '#1a73e8' : '#555'};">Affiché</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Numéro IBAN</label>
                    <input type="text" id="opt-iban" value="${escapeHtml(client.iban || '')}" placeholder="PL00 0000 0000 0000 0000 0000 0000">
                </div>
                <div class="form-group">
                    <label>Code SWIFT / BIC</label>
                    <input type="text" id="opt-swift" value="${escapeHtml(client.swift || '')}" placeholder="Ex: WBKPPLPPXXX">
                </div>
            `;
            break;

        case 'transfer_params':
            headerIcon = 'fa-percent';
            headerTitle = 'Paramètres de virement';
            headerSubtitle = 'Pourcentage limite et message après virement';
            bodyHtml = `
                <div class="form-group">
                    <label>Pourcentage appliqué</label>
                    <div class="percentage-row">
                        <span class="percentage-label">Si inférieur ou égal à</span>
                        <input type="number" id="opt-percent" min="0" max="100" value="${client.percentValue || 100}">
                        <span class="percentage-label">%</span>
                    </div>
                    <small>Le virement sera refusé si le montant dépasse ce pourcentage du solde.</small>
                </div>
                <div class="form-group">
                    <label>Message affiché après le virement</label>
                    <textarea id="opt-message" rows="3">${escapeHtml(client.messageAfterTransfer || '')}</textarea>
                </div>
            `;
            break;

        case 'color':
            headerIcon = 'fa-palette';
            headerTitle = 'Couleur du thème';
            headerSubtitle = 'Couleur principale du compte client';
            const currentColor = client.color || '#ff7a00';
            bodyHtml = `
                <div class="form-group">
                    <label>Couleur principale</label>
                    <div class="color-picker" id="opt-color-picker">
                        ${['#ff7a00', '#1a73e8', '#00c853', '#e02424', '#8e24aa', '#00838f', '#f9a825', '#37474f', '#d81b60', '#43a047']
                            .map(c => `<div class="color-option ${c === currentColor ? 'selected' : ''}" data-color="${c}" style="background-color:${c};"></div>`)
                            .join('')}
                    </div>
                    <input type="hidden" id="opt-color" value="${currentColor}">
                </div>
            `;
            break;

        // 🆕 NOUVELLE OPTION : COULEUR DE LA GRANDE CARTE
        case 'big_card_color':
            headerIcon = 'fa-credit-card';
            headerTitle = 'Couleur de la grande carte';
            headerSubtitle = 'Changer la couleur de la carte de solde';
            const currentBigColor = client.bigCardColor || '#ffffff';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Choisissez une couleur pour la carte de solde. Le texte s'adaptera automatiquement (noir ou blanc) pour rester lisible.</span>
                </div>
                <div class="form-group">
                    <label>Couleur de la carte</label>
                    <div class="color-picker" id="opt-big-card-color-picker">
                        ${['#ffffff', '#1a1a1a', '#1a73e8', '#0d47a1', '#00c853', '#03543f', '#e02424', '#8e24aa', '#f9a825', '#37474f']
                            .map(c => `<div class="color-option ${c === currentBigColor ? 'selected' : ''}" data-color="${c}" style="background-color:${c}; border: 1px solid #ccc;"></div>`)
                            .join('')}
                    </div>
                    <input type="hidden" id="opt-big-card-color" value="${currentBigColor}">
                </div>
            `;
            break;

        case 'reset':
            headerIcon = 'fa-eraser';
            headerTitle = 'Réinitialiser le compte';
            headerSubtitle = 'Mettre le solde à zéro et vider l\'historique';
            bodyHtml = `
                <div class="option-info-box" style="background:#fef2f2; border-color:#fecaca; color:#e02424;">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span><strong>Attention :</strong> Cette action est irréversible. Elle remettra le solde de ce client à 0 et supprimera définitivement toutes ses transactions.</span>
                </div>
                <div class="option-status-box">
                    <span class="option-status-box-label">Solde actuel :</span>
                    <span class="option-status-box-value">${Number(client.balance || 0).toFixed(2)} ${client.currency || 'zł'}</span>
                </div>
            `;
            break;

        case 'access':
            headerIcon = 'fa-ban';
            headerTitle = 'Accès du client';
            headerSubtitle = 'Bloquer ou débloquer le compte client';
            const statusClass = client.blocked ? 'blocked' : 'active';
            const statusText = client.blocked ? 'Bloqué' : 'Actif';
            bodyHtml = `
                <div class="option-info-box">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Bloquez l'accès d'un client pour suspendre temporairement sa connexion.</span>
                </div>
                <div class="option-status-box">
                    <span class="option-status-box-label">Statut actuel :</span>
                    <span class="option-status-box-value ${statusClass}">${statusText}</span>
                </div>
            `;
            break;

        case 'transaction':
            headerIcon = 'fa-plus';
            headerTitle = 'Ajouter un virement';
            headerSubtitle = 'Ajouter un virement au compte client';
            bodyHtml = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Montant du virement <span class="required">. requis</span></label>
                        <div class="input-with-addon">
                            <input type="number" id="opt-tx-amount" step="0.01" placeholder="0.00">
                            <div class="input-addon">${client.currency || 'zł'}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Type d'opération <span class="required">. requis</span></label>
                        <select id="opt-tx-type">
                            <option value="credit">Crédit (+) - Ajouter au solde</option>
                            <option value="debit">Débit (-) - Retirer du solde</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Banque <span class="required">. requis</span></label>
                    <select id="opt-tx-bank">
                        <option value="">-- Sélectionner une banque --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date et heure <span class="optional">. facultatif</span></label>
                    <input type="text" id="opt-tx-date" placeholder="Ex: 23/09/2026 • 01:24">
                </div>
            `;
            break;
    }

    let actionButtons = '';
    if (option === 'access') {
        const blockBtn = client.blocked
            ? `<button type="button" class="btn-unblock" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #c3e6cb;color:#03543f;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-unlock"></i> Débloquer l'accès
               </button>`
            : `<button type="button" class="btn-block" id="opt-access-btn" style="padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:2px solid #f5c6cb;color:#e02424;background:#fff;display:inline-flex;align-items:center;gap:6px;">
                   <i class="fa-solid fa-ban"></i> Bloquer l'accès
               </button>`;

        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            ${blockBtn}
        `;
    } else if (option === 'reset') {
        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            <button type="button" class="btn-option-save" id="opt-save-btn" style="background-color: #e02424;">
                <i class="fa-solid fa-eraser"></i> Réinitialiser
            </button>
        `;
    } else {
        actionButtons = `
            <button type="button" class="btn-option-cancel" onclick="cancelOptionCard()">
                <i class="fa-solid fa-xmark"></i> Annuler
            </button>
            <button type="button" class="btn-option-save" id="opt-save-btn">
                <i class="fa-solid fa-floppy-disk"></i> Enregistrer
            </button>
        `;
    }

    container.innerHTML = `
        <div class="option-card">
            <div class="option-card-header">
                <div class="option-card-header-icon">
                    <i class="fa-solid ${headerIcon}"></i>
                </div>
                <div>
                    <div class="option-card-header-title">${headerTitle}</div>
                    <div class="option-card-header-subtitle">${headerSubtitle}</div>
                </div>
            </div>
            <div class="option-card-body">
                ${bodyHtml}
            </div>
            <div class="option-card-actions">
                ${actionButtons}
            </div>
        </div>
    `;

    if (option === 'color') {
        const picker = document.getElementById('opt-color-picker');
        picker.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('opt-color').value = opt.dataset.color;
            });
        });
    }

    // 🆕 ÉCOUTEURS POUR LE PICKER DE COULEUR DE LA GRANDE CARTE
    if (option === 'big_card_color') {
        const picker = document.getElementById('opt-big-card-color-picker');
        picker.querySelectorAll('.color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                picker.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('opt-big-card-color').value = opt.dataset.color;
            });
        });
    }

    if (option === 'bank') {
        populateBankSelect('opt-bank', client.country, client.bankDomain);
    }

    if (option === 'transaction') {
        populateBankSelect('opt-tx-bank', client.country);
    }

    if (option === 'access') {
        const btn = document.getElementById('opt-access-btn');
        if (btn) btn.addEventListener('click', handleToggleAccess);
    } else {
        const saveBtn = document.getElementById('opt-save-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => saveOption(option, client));
    }

    // 🆕 ÉCOUTEURS POUR LES BOUTONS RADIO DE LA CARTE
    if (option === 'card_info') {
        const radios = container.querySelectorAll('input[name="card-visibility"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                radios.forEach(r => {
                    const label = r.closest('label');
                    if (r.checked) {
                        label.style.borderColor = '#1a73e8';
                        label.style.backgroundColor = '#e8f0fe';
                        label.querySelector('span').style.color = '#1a73e8';
                    } else {
                        label.style.borderColor = '#dcdfe6';
                        label.style.backgroundColor = '#fff';
                        label.querySelector('span').style.color = '#555';
                    }
                });
            });
        });
    }

    // 🆕 ÉCOUTEURS POUR LES BOUTONS RADIO DE L'IBAN
    if (option === 'iban_info') {
        const radios = container.querySelectorAll('input[name="iban-visibility"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                radios.forEach(r => {
                    const label = r.closest('label');
                    if (r.checked) {
                        label.style.borderColor = '#1a73e8';
                        label.style.backgroundColor = '#e8f0fe';
                        label.querySelector('span').style.color = '#1a73e8';
                    } else {
                        label.style.borderColor = '#dcdfe6';
                        label.style.backgroundColor = '#fff';
                        label.querySelector('span').style.color = '#555';
                    }
                });
            });
        });
    }
}

// ============================================================
// ANNULER LA CARTE D'OPTION
// ============================================================
function cancelOptionCard() {
    resetCustomSelect();
    document.getElementById('option-card-container').innerHTML = '';
    selectedOption = null;
}

// ============================================================
// SAUVEGARDE CIBLÉE PAR OPTION
// ============================================================
async function saveOption(option, client) {
    const btn = document.getElementById('opt-save-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enregistrement...';

    try {
        let updatedData = { updatedAt: new Date().toISOString() };

        switch (option) {
            case 'info': {
                const lastName = document.getElementById('opt-lastname').value.trim();
                const firstName = document.getElementById('opt-firstname').value.trim();
                const country = document.getElementById('opt-country').value;
                const countryFlag = document.querySelector('#opt-country option:checked')?.dataset.flag || '';
                const address = document.getElementById('opt-address').value.trim();

                if (!lastName || !firstName) throw new Error('Nom et prénom obligatoires.');
                if (!country) throw new Error('Pays obligatoire.');

                updatedData = { ...updatedData, lastName, firstName, country, countryFlag, address };
                break;
            }

            case 'contact': {
                const email = document.getElementById('opt-email').value.trim().toLowerCase();
                const phone = document.getElementById('opt-phone').value.trim();

                if (!email.includes('@') || !email.includes('.')) throw new Error('Adresse e-mail invalide.');

                const emailCheck = query(collection(db, COLLECTION_NAME), where('email', '==', email));
                const existing = await getDocs(emailCheck);
                const taken = existing.docs.some(d => d.id !== selectedClientId);
                if (taken) throw new Error('Cet e-mail est utilisé par un autre client.');

                updatedData = { ...updatedData, email, phone };
                break;
            }

            case 'account': {
                const balance = parseFloat(document.getElementById('opt-balance').value) || 0;
                const currency = document.getElementById('opt-currency').value;
                const language = document.getElementById('opt-language').value;
                updatedData = { ...updatedData, balance, currency, language };
                break;
            }

            case 'bank': {
                const bankSelect = document.getElementById('opt-bank');
                const bankDomain = bankSelect.value;
                const bankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = bankOpt?.dataset.bankName || '';

                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');

                const bankLogo = getBankLogoUrl(bankDomain);
                updatedData = { ...updatedData, bankName, bankDomain, bankLogo };
                break;
            }

            case 'security': {
                const pin = document.getElementById('opt-pin').value.trim();
                const activationCode = document.getElementById('opt-activation').value.trim();

                if (!/^\d{4,8}$/.test(pin)) throw new Error('Le code PIN doit contenir 4 à 8 chiffres.');
                if (activationCode.length < 4) throw new Error("Le code d'activation doit contenir au moins 4 caractères.");

                updatedData = { ...updatedData, pin, activationCode };
                break;
            }

            case 'card_info': {
                const cardNumber = document.getElementById('opt-card-number').value.trim();
                const cardExpiry = document.getElementById('opt-card-expiry').value.trim();
                const cardCVV = document.getElementById('opt-card-cvv').value.trim();
                
                const visibilityRadio = document.querySelector('input[name="card-visibility"]:checked');
                const canViewCardDetails = visibilityRadio ? visibilityRadio.value === 'shown' : false;

                if (cardNumber.length < 15) throw new Error('Numéro de carte invalide.');
                if (cardExpiry.length < 4) throw new Error('Date d\'expiration invalide.');
                if (cardCVV.length < 3) throw new Error('CVV invalide.');

                updatedData = { ...updatedData, cardNumber, cardExpiry, cardCVV, canViewCardDetails };
                break;
            }

            // 🆕 SAUVEGARDE DE L'IBAN ET DE L'AUTORISATION
            case 'iban_info': {
                const iban = document.getElementById('opt-iban').value.trim();
                const swift = document.getElementById('opt-swift').value.trim();
                
                const visibilityRadio = document.querySelector('input[name="iban-visibility"]:checked');
                const canViewIban = visibilityRadio ? visibilityRadio.value === 'shown' : false;

                if (iban.length < 10) throw new Error('Numéro IBAN invalide.');
                if (swift.length < 8) throw new Error('Code SWIFT invalide.');

                updatedData = { ...updatedData, iban, swift, canViewIban };
                break;
            }

            case 'transfer_params': {
                const percentValue = parseInt(document.getElementById('opt-percent').value, 10);
                const messageAfterTransfer = document.getElementById('opt-message').value.trim();

                if (isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
                    throw new Error('Le pourcentage doit être entre 0 et 100.');
                }
                if (!messageAfterTransfer) throw new Error('Le message est obligatoire.');

                updatedData = { ...updatedData, percentValue, messageAfterTransfer };
                break;
            }

            case 'color': {
                const color = document.getElementById('opt-color').value;
                if (!color) throw new Error('Veuillez choisir une couleur.');
                updatedData = { ...updatedData, color };
                break;
            }

            // 🆕 SAUVEGARDE DE LA COULEUR DE LA GRANDE CARTE
            case 'big_card_color': {
                const bigCardColor = document.getElementById('opt-big-card-color').value;
                if (!bigCardColor) throw new Error('Veuillez choisir une couleur.');
                updatedData = { ...updatedData, bigCardColor };
                break;
            }

            case 'reset': {
                const isConfirmed = await showConfirmModal({
                    title: 'Réinitialiser le compte',
                    message: `Êtes-vous sûr de vouloir réinitialiser le compte de ${client.firstName} ${client.lastName} ?\n\nLe solde sera mis à 0 et l'historique des transactions sera définitivement supprimé.`,
                    confirmText: 'Réinitialiser',
                    type: 'danger'
                });

                if (!isConfirmed) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                    return;
                }

                updatedData = { ...updatedData, balance: 0, transactions: [] };
                break;
            }

            case 'transaction': {
                const amount = parseFloat(document.getElementById('opt-tx-amount').value);
                const type = document.getElementById('opt-tx-type').value;
                const dateInput = document.getElementById('opt-tx-date').value.trim();
                const bankSelect = document.getElementById('opt-tx-bank');
                const bankDomain = bankSelect.value;
                const selectedBankOpt = bankSelect.options[bankSelect.selectedIndex];
                const bankName = selectedBankOpt?.dataset.bankName || '';

                if (!amount || amount <= 0) throw new Error('Montant invalide.');
                if (!bankDomain || !bankName) throw new Error('Veuillez sélectionner une banque.');

                const finalAmount = type === 'credit' ? amount : -amount;
                const now = new Date();
                const dateStr = dateInput || (now.toLocaleDateString('fr-FR') + ' • ' +
                    now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

                const newTx = {
                    type: type,
                    title: bankName,
                    date: dateStr,
                    amount: finalAmount,
                    bankName: bankName,
                    bankDomain: bankDomain,
                    bankLogo: getBankLogoUrl(bankDomain)
                };

                const transactions = (client.transactions || []).slice();
                transactions.unshift(newTx);
                const newBalance = (Number(client.balance) || 0) + finalAmount;

                updatedData = { ...updatedData, balance: newBalance, transactions };
                break;
            }

            default:
                throw new Error('Option non reconnue.');
        }

        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), updatedData);

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx] = { ...allClients[idx], ...updatedData };

        await loadClients();
        showToast('Modifications enregistrées !', 'success');
        cancelOptionCard();

    } catch (err) {
        console.error('Erreur sauvegarde :', err);
        showToast(err.message || 'Erreur lors de l\'enregistrement.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ============================================================
// BLOQUER / DÉBLOQUER
// ============================================================
async function handleToggleAccess() {
    if (!selectedClientId) return;
    const client = allClients.find(c => c.id === selectedClientId);
    if (!client) return;

    const willBlock = !client.blocked;
    const confirmMsg = willBlock
        ? `Bloquer l'accès de ${client.firstName} ${client.lastName} ?`
        : `Débloquer l'accès de ${client.firstName} ${client.lastName} ?`;

    const isConfirmed = await showConfirmModal({
        title: willBlock ? 'Bloquer le client' : 'Débloquer le client',
        message: confirmMsg,
        confirmText: willBlock ? 'Bloquer' : 'Débloquer',
        type: willBlock ? 'danger' : 'primary'
    });

    if (!isConfirmed) return;

    const btn = document.getElementById('opt-access-btn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Traitement...';

    try {
        await updateDoc(doc(db, COLLECTION_NAME, selectedClientId), { blocked: willBlock });

        const idx = allClients.findIndex(c => c.id === selectedClientId);
        if (idx !== -1) allClients[idx].blocked = willBlock;

        await loadClients();
        showToast(willBlock ? 'Accès bloqué.' : 'Accès débloqué.', 'success');
        cancelOptionCard();

    } catch (err) {
        console.error(err);
        showToast('Erreur lors du traitement.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}

// ============================================================
// SUPPRIMER / TOUT EFFACER
// ============================================================
async function deleteClient(id) {
    const client = allClients.find(c => c.id === id);
    if (!client) return;
    
    const isConfirmed = await showConfirmModal({
        title: 'Supprimer le client',
        message: `Supprimer définitivement ${client.firstName} ${client.lastName} ?`,
        confirmText: 'Supprimer',
        type: 'danger'
    });

    if (!isConfirmed) return;

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        if (selectedClientId === id) {
            selectedClientId = null;
            document.getElementById('m-select-client').value = '';
            document.getElementById('option-select-wrapper').style.display = 'none';
            document.getElementById('option-card-container').innerHTML = '';
            resetCustomSelect();
        }
        await loadClients();
        showToast('Client supprimé.', 'info');
    } catch (err) {
        console.error('Erreur suppression :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

async function clearAllClients() {
    if (allClients.length === 0) return;
    
    const isConfirmed = await showConfirmModal({
        title: 'Tout effacer',
        message: `Supprimer TOUS vos ${allClients.length} clients ? Cette action est irréversible.`,
        confirmText: 'Tout supprimer',
        type: 'danger'
    });

    if (!isConfirmed) return;

    try {
        for (const client of allClients) {
            await deleteDoc(doc(db, COLLECTION_NAME, client.id));
        }
        await loadClients();
        showToast('Tous vos clients ont été supprimés.', 'info');
    } catch (err) {
        console.error('Erreur suppression totale :', err);
        showToast('Erreur lors de la suppression.', 'error');
    }
}

// ============================================================
// MODAL LIEN
// ============================================================
function closeModal() {
    document.getElementById('link-modal').classList.remove('show');
}

function copyGeneratedLink() {
    const input = document.getElementById('generated-link');
    input.select();
    const value = input.value;

    const doCopy = () => {
        const btn = document.getElementById('copy-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
        btn.style.backgroundColor = '#00c853';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.backgroundColor = '';
        }, 2000);
        showToast('Lien copié !', 'success');
    };

    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(doCopy).catch(() => prompt('Copiez :', value));
    } else {
        prompt('Copiez :', value);
    }
}

function openGeneratedLink() {
    if (lastGeneratedLink) window.open(lastGeneratedLink, '_blank');
}

// ============================================================
// EXPOSITION GLOBALE
// ============================================================
window.clearAllClients = clearAllClients;
window.closeModal = closeModal;
window.copyGeneratedLink = copyGeneratedLink;
window.openGeneratedLink = openGeneratedLink;
window.closeClientDetail = closeClientDetail;
window.editClientFromDetail = editClientFromDetail;
window.copyField = window.copyField;
window.cancelOptionCard = cancelOptionCard;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.handleAdminLogout = handleAdminLogout;
window.handleSendLoginCredentials = handleSendLoginCredentials;
window.handleSendActivationCode = handleSendActivationCode;

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-login-form').addEventListener('submit', handleAdminLogin);
    document.getElementById('admin-register-form').addEventListener('submit', handleAdminRegister);
    document.getElementById('create-client-form').addEventListener('submit', handleCreateClient);

    populateBankSelect('c-bank', 'France', '');
    document.getElementById('c-country').addEventListener('change', (e) => {
        populateBankSelect('c-bank', e.target.value, '');
    });

    document.getElementById('link-modal').addEventListener('click', (e) => {
        if (e.target.id === 'link-modal') closeModal();
    });
    document.getElementById('client-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'client-detail-modal') closeClientDetail();
    });

    document.getElementById('m-select-client').addEventListener('change', handleModifyClientChange);

    initCustomSelect();

    const loginEmail = document.getElementById('login-admin-email');
    const loginPassword = document.getElementById('login-admin-password');
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';

    const registerForm = document.getElementById('admin-register-form');
    if (registerForm) registerForm.reset();

    initAuthListener();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeClientDetail();
        const selectWrapper = document.getElementById('custom-option-select');
        if (selectWrapper) selectWrapper.classList.remove('open');
    }
});
