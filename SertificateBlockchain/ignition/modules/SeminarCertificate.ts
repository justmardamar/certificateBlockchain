import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SeminarCertificateModule = buildModule("SeminarCertificateModule",(m) => {
    const certificateRegistry = m.contract("SeminarCertificate")

    return {certificateRegistry}
})

export default SeminarCertificateModule