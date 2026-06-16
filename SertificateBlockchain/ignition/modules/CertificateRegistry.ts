import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertificateRegistryModule", (m)=>{
    const certificateRegistry = m.contract("CertificateRegistry");

    return {certificateRegistry};
});
//deploy contract : 0x5FbDB2315678afecb367f032d93F642f64180aa3