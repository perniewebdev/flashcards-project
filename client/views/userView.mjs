
export class UserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "./app.css";
        this.shadow.appendChild(styleLink);
        this.container = document.createElement("div");
        this.container.classList.add("user-container");
        this.shadow.appendChild(this.container);
    }

    refresh(user = {}) {
        this.container.innerHTML = `
            <form id="signup-form">
                <input id="email" type="email" placeholder="Email" value="${user.email ?? ""}" required>
                <input id="password" type="password" placeholder="Password" required>
                <div class="consent-row">
                    <label><input type="checkbox" id="consent"> I agree to Terms</label>
                    <button type="button" id="show-tos">TOS</button>
                    <button type="button" id="show-privacy">Privacy</button>
                </div>
                <div id="policy-container"></div>
                <button id="signup-btn" disabled>Create account</button>
            </form>
            <form id="edit-form">
                <input id="new-email" type="email" placeholder="New Email">
                <input id="new-password" type="password" placeholder="New Password">
                <button id="edit-btn">Update User</button>
            </form>
            <button id="delete-account">Delete account</button>
        `;
        this.bindEvents();
    }

    bindEvents() {
        const consent = this.shadow.getElementById("consent");
        const signupBtn = this.shadow.getElementById("signup-btn");
        const form = this.shadow.getElementById("signup-form");
        const deleteBtn = this.shadow.getElementById("delete-account");
        const editBtn = this.shadow.getElementById("edit-btn");
        const policyContainer = this.shadow.getElementById("policy-container");

        consent.addEventListener("change", () => signupBtn.disabled = !consent.checked);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("create-user", {
                composed: true, bubbles: true,
                detail: {
                    email: this.shadow.getElementById("email").value,
                    password: this.shadow.getElementById("password").value
                }
            }));
        });

        deleteBtn.addEventListener("click", () => this.dispatchEvent(new CustomEvent("delete-user", { composed: true, bubbles: true })));

        editBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("update-user", {
                composed: true, bubbles: true,
                detail: {
                    email: this.shadow.getElementById("new-email").value,
                    password: this.shadow.getElementById("new-password").value
                }
            }));
        });

        this.shadow.getElementById("show-tos").addEventListener("click", () => this.showPolicy(policyContainer, "tos"));
        this.shadow.getElementById("show-privacy").addEventListener("click", () => this.showPolicy(policyContainer, "privacy"));
    }

    showPolicy(container, type) {
        container.innerHTML = "";
        if (type === "tos") {
            container.innerHTML = `
                <div class="policy">
                    <h3>Terms of Service</h3>
                    <ul>
                        <li>You own your data.</li>
                        <li>We only use data to run the app.</li>
                        <li>You can delete your account anytime.</li>
                    </ul>
                    <button id="close-policy">Close</button>
                </div>
            `;
        }
        if (type === "privacy") {
            container.innerHTML = `
                <div class="policy">
                    <h3>Privacy Policy</h3>
                    <ul>
                        <li>We collect only necessary data.</li>
                        <li>Data is stored safely.</li>
                    </ul>
                    <button id="close-policy">Close</button>
                </div>
            `;
        }
        container.querySelector("#close-policy")?.addEventListener("click", () => container.innerHTML = "");
    }
}

customElements.define("user-view", UserView);
