# Tata Cara Set Up dan Menjalankan Aplikasi

# Persiapan
1. Dokumentasi terkait Instalasi Node.js di [https://nodejs.org/](https://nodejs.org/)
2. Dokumentasi terkait Instalasi Hardhat di [https://hardhat.org/](https://hardhat.org/)
3. Dokumentasi terkait Instalasi Next.js di [https://nextjs.org/](https://nextjs.org/)

## Instalasi HardHat
1. Buka Terminal
2. Masuk ke directory SertificateBlockchain 
3. Jalankan perintah npm install --save-dev hardhat

## Instalasi Next JS
1. Buka Terminal
2. Jalankan perintah npx create-next-app@latest (Nama Project)

## Instalasi Ethers.js di Next JS
1. Buka Terminal
2. Masuk ke directory frontendnext 
3. Jalankan perintah npm install ethers

## tata cara menjalankan project ini
1. Buka sekitar 2 - 3 terminal
2. Terminal Pertama untuk menjalankan frontendnya dan yang kedua untuk mendeploy dan menjalankan contract nya
3. Jalankan perintah npx hardhat node untuk menjalankan blockchain
4. jalankan perintah npx hardhat ignition deploy ignition/modules/SeminarCertificate.ts --network localhost     untuk mendeploy contract ke blockchain.
5. jalankan perintah npm run dev untuk menjalankan frontendnya.
6. Setelah men deploy akan muncul contract Address dan setelah mengcompile project akan muncul SeminarCertificate.json di folder artifacts
7. Setelah menjalankan blockchainnya akan muncul beberapa account dan private key 
8. copy salah satu private key lalu paste ke file blockchain.ts di variabel adminPrivateKey
9. copy contract address nya lalu paste ke file blockchain.ts di variabel contractAddress
10. copy seminar certificate.json dari folder artifacts/contracts/SeminarCertificate.sol/ ke folder app/dashboard/SeminarCertificate.json
11. setelah itu website akan berjalan dengan normal dan berhasil di jalankan

 