"use client";
import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDebounce } from "../hooks/useDebounce";
import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from "wagmi";
import {
    erc20ContractConfig,
    vaultContractConfig,
} from "../components/contracts";
import { ethers } from "ethers";

const Page = () => {
    const [amount, setAmount] = useState<number>(0);

    const debouncedAmount = useDebounce(amount);

    const { config: approveConfig } = usePrepareContractWrite({
        ...erc20ContractConfig,
        functionName: "approve",
        enabled: Boolean(amount),
        args: [vaultContractConfig.address, BigInt(amount * 10 ** 18)],
    });
    const { write: writeApprove, data: dataApprove } =
        useContractWrite(approveConfig);
    const {
        data: receiptApprove,
        isLoading: isPendingApprove,
        isSuccess: isSuccessApprove,
    } = useWaitForTransaction({ hash: dataApprove?.hash });

    const handleApprove = () => {
        console.log(`Approving ${amount}`);
        writeApprove?.();
    };

    const { config: configDeposit } = usePrepareContractWrite({
        ...vaultContractConfig,
        functionName: "deposit",
        enabled: Boolean(amount),
        args: [BigInt(amount * 10 ** 18), BigInt(2 * 10 ** 15)],
        value: BigInt(2 * 10 ** 15),
    });

    const { write: writeDeposit, data: dataDeposit } =
        useContractWrite(configDeposit);
    const {
        data: receiptDeposit,
        isLoading: isPendingDeposit,
        isSuccess: isSuccessDeposit,
    } = useWaitForTransaction({ hash: dataDeposit?.hash });

    const { config: configWithdraw } = usePrepareContractWrite({
        ...vaultContractConfig,
        functionName: "withdraw",
        enabled: true,
        args: [
            BigInt(amount * 10 ** 18),
            BigInt(2 * 10 ** 15),
            BigInt(2 * 10 ** 15),
        ],
        value: BigInt(2 * 10 ** 15),
    });
    const { write: writeWithdraw, data: dataWithdraw } =
        useContractWrite(configWithdraw);
    const {
        data: receiptWithdraw,
        isLoading: isPendingWithdraw,
        isSuccess: isSuccessWithdraw,
    } = useWaitForTransaction({ hash: dataWithdraw?.hash });

    const handleDeposit = () => {
        handleApprove();
        console.log(`Depositing ${amount}`);
        console.log([BigInt(debouncedAmount * 10 ** 18), BigInt(1 * 10 ** 16)]);
        writeDeposit?.();
    };

    const handleWithdraw = () => {
        console.log(`Withdrawing ${amount}`);
        writeWithdraw?.();
    };

    return (
        <>
            <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
                <ConnectButton />
            </Box>
            <Typography align="center" pb={-20}>
                <img
                    src="https://cdn.discordapp.com/attachments/1159043590522155060/1165512267798958110/crondex_3.png?ex=65471ee2&is=6534a9e2&hm=afc5246ef4a7d00898a4e5d39b95c551e350cc0f180d4a7489523502421e371d&"
                    width={200}
                    height={200}
                />
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                mt: 2,
                                gap: 4,
                            }}
                        >
                            <Box>
                                <Typography variant="h3" fontWeight="bold">
                                    Cross Chain Vault
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    The best cross chain yeilds in DeFi with a
                                    single click
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    TVL: $50k
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    Yield: 12%
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontWeight="bold">
                                    Deposit Cap: 50k
                                </Typography>
                            </Box>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">
                                    Amount
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
                                    }
                                    label="Amount"
                                    type="number"
                                    onChange={(event) =>
                                        setAmount(Number(event.target.value))
                                    }
                                />
                            </FormControl>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mt: 4,
                                    gap: 1,
                                }}
                            >
                                {/* <Button
                                    variant="contained"
                                    onClick={handleApprove}
                                >
                                    Approve
                                </Button> */}
                                <Button
                                    variant="contained"
                                    onClick={handleDeposit}
                                >
                                    Deposit
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleWithdraw}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Page;
