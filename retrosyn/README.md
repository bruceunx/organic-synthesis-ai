# 🧪 Organic Synthesis AI Assistant

Welcome to **Organic Synthesis AI Assistant**! 🚀
This desktop application, built with **Electron** and **ReactJS**, is your intelligent lab partner for designing organic synthesis routes. 🎨🤖

---

<p align="center">
  <img src="./docs/screenshot1.png" alt="App Screenshot" width="700">
</p>

<p align="center">
  <img src="docs/screenshot2.png" alt="App Screenshot" width="700">
</p>

---

## ✨ Features

- **AI-Powered Design** 🧠: Utilize advanced AI to generate and optimize synthesis routes for complex organic molecules.
- **User-Friendly Interface** 💻: Seamlessly explore synthesis plans in an intuitive, modern UI.
- **Customizable Parameters** 🛠️: Tailor the design process to meet your specific research needs.
- **Offline Mode** 🌐: Access the app and your saved projects even without an internet connection.

> [!NOTE]
> We currently provide 6 models, namely, reaxys, reaxys_biocatalysis, cas, pistachio, pistachio_ringbreaker and bkms_metabolic. The request format is the same; simply replace the last part of the URL with the desired model name. For instance, the endpoint for the pistachio_ringbreaker model is http://0.0.0.0:9410/predictions/pistachio_ringbreaker.
> torchserve --start --foreground --ncs --model-store=mars --models reaxys=reaxys.mar

## 🔧 Installation

1. **Clone the Repository**

```bash
git clone  https://github.com/bruceunx/organic-synthesis-ai
cd organic-synthesis-ai
```

2. **Then install the dependencies**:

```bash
pnpm install

```

3. **Run the App**

```bash
pnpm start
```

## 📚 Usage

1. Launch the app and input the target molecule structure (SMILES, InChI, or graphical editor). 🖋️
2. Configure synthesis parameters (e.g., reaction conditions, starting materials). 🔬
3. Let the AI generate a synthesis plan. ⚙️
4. Review, refine, and export the plan as a report. 📄

## 🤝 Contributing

Contributions are welcome! 🌟

- Fork the repo. 🍴
- Create a branch for your feature. 🌿
- Submit a pull request. 🚀
- 📜 License
- This project is licensed under the MIT License.

## ❤️ Acknowledgments

Special thanks to the open-source community for providing invaluable tools and libraries that power this app. 🙌
