# 🚀 Blind Chat Platform

Blind Chat is a platform designed for students of a specific college to connect and interact with their peers using their official college email IDs. The platform enables real-time communication via WebSocket and a modern frontend built with Next.js. The project is open-source, and you can easily adapt it for your own college by modifying the configuration file.

![Blind-Chat - An open-source web app for college students to connect using their official email IDs. Easily customizable for any college with a simple config file.](/.github/images/img_main.png "Blind-Chat - An open-source web app for college students to connect using their official email IDs. Easily customizable for any college with a simple config file.")


## ✨ Features

- 🛡️ **Student Authentication**: Sign up using your official college email ID.
- 💬 **Real-Time Chat**: Seamless communication with peers using WebSocket.
- 🛠️ **Customizable**: Adaptable for any college with minimal changes.

## 🛑 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 🚀
- **Backend**: WebSocket server powered by [Socket.IO](https://socket.io/) 🌐
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) 🔐
- **Database**: [Prisma](https://www.prisma.io/) + PostgreSQL 🗄️
- **Styling**: Tailwind CSS 🎨
- **Email Services**: Nodemailer 📧

## 📚 How to Use

1. Clone the repository.
2. Follow the installation instructions to set up the WebSocket server and Next.js app locally.
3. Customize the configuration file to align with your college's details.

For detailed setup instructions, refer to the [📄 Installation Guide](https://github.com/idityaGE/Blind-Chat/blob/main/INSTALLATION.md).

## ☁️ Cloud Architecture
![Cloud Architecture Image](https://res.cloudinary.com/dwdbqwqxk/image/upload/v1735479559/diagram-export-29-12-2024-7_04_50-pm_skau22.png)

## 🧷 Simple Flow Diagram
![Simple Flow Diagram Image](https://res.cloudinary.com/dwdbqwqxk/image/upload/v1735479572/Untitled-2024-12-06-1452_kfjeq1.png)

## 🛠️ Customizing for Your College

The platform uses a configuration file to define college-specific details. Here's how you can update it:

```javascript
/** Example
 * @email : 2023btcse002@curaj.ac.in
 * -->
 * @localPart : 2023btcse002
 * @separator : @ 
 * @domainName : curaj.ac.in
 */

export const studentEmailConfig = {
  college: {
    name: 'Your College Name',
    shortHand: 'Short Name',
  },
  localPart: {
    example: "2023BTCSE017", // enrollment ID
    regex: /^\d{4}[A-Za-z]+\d{3}$/,  // Regex for enrollment ID
  },
  domainName: 'yourcollege.ac.in',
  support_email: 'support@yourcollege.ac.in'
}
```

1. Update the `college` and `domainName` fields to match your college.
2. Customize the regex for student email IDs if needed.
3. Save the file and restart the application.

## ❤️ Support Me

- ☕ **[Buy Me a Coffee](https://www.buymeacoffee.com/idityage)**: If you like this project, consider supporting me!
- 🐦 **[Follow Me on Twitter](https://twitter.com/idityage)**: Stay updated with my latest projects and tech adventures.

## 🌱 Getting Started

To get started, head over to the [📄 Installation Guide](https://github.com/idityaGE/Blind-Chat/blob/main/INSTALLATION.md) and follow the steps to set up the platform locally.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues, fork the repository, and open pull requests to improve the platform.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

### 🔗 Repository Link

[GitHub Repository](https://github.com/idityaGE/Blind-Chat)



## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.
