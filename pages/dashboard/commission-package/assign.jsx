import React, { useState } from 'react'
import {
    Box,
    Text,
    Stack,
    FormControl,
    FormLabel,
    InputGroup,
    Input,
    InputRightAddon,
    Select,
    useToast,
    HStack,
    Button
} from '@chakra-ui/react'
import Layout from '../layout'
import BackendAxios from '@/lib/utils/axios'
import { useFormik } from 'formik'

const Assign = () => {
    const Toast = useToast({ position: 'top-right' })
    const [fetchedUser, setFetchedUser] = useState({
        id: "",
        user_name: "",
        firm_name: "",
        wallet: "",
        phone: "",
    })

    const Formik = useFormik({
        initialValues: {
            beneficiaryId: fetchedUser?.id || "",
            packageId: ""
        },
        onSubmit: values => {
            if (!values.beneficiaryId && !values.packageId) {
                Toast({
                    description: 'Please enter correct details'
                })
            }
            else {
                BackendAxios.post(`/api/admin/new-fund`, values).then(res => {
                    Toast({
                        status: 'success',
                        description: 'Package assigned successfully!'
                    })
                }).catch(err => {
                    Toast({
                        status: 'error',
                        description: err.response.data.message || err.response.data || err.message
                    })
                })
            }
        }
    })

    const verifyBeneficiary = (queriedUserId) => {
        // Logic to verifiy beneficiary details
        BackendAxios.post(`/api/admin/user/info/${queriedUserId || Formik.values.beneficiaryId}`).then((res) => {
            Formik.setFieldValue("beneficiaryId", res.data.data.id)
            setFetchedUser({
                ...fetchedUser,
                id: res.data.data.id,
                user_name: res.data.data.first_name + " " + res.data.data.last_name,
                firm_name: res.data.data.firm_name,
                phone: res.data.data.phone_number,
                wallet: res.data.data.wallet,

            })
        }).catch((err) => {
            Toast({
                status: 'error',
                description: err.response.data.message || err.response.data || 'User not found!'
            })
            setFetchedUser({
                user_name: "",
                firm_name: "",
                wallet: "",
                phone: "",
            })
        })
    }

    return (
        <>
            <Layout pageTitle={'Assign Package'}>
                <Text fontWeight={'semibold'} fontSize={'lg'}>Fund Transfer</Text>

                <Box py={6}>
                    <Box
                        rounded={16}
                        overflow={'hidden'}
                    >
                        <Box
                            bg={'twitter.500'}
                            p={3} color={'white'}
                        >
                            <Text>Transfer Funds To Any Registered User</Text>
                        </Box>
                        <Box p={4}>
                            <Stack
                                direction={['column', 'row']}
                                spacing={6} py={6}
                            >
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>User ID</FormLabel>
                                    <InputGroup>
                                        <Input
                                            name={'beneficiaryId'}
                                            value={Formik.values.beneficiaryId}
                                            onChange={Formik.handleChange}
                                            placeholder={'Enter Beneficiary User ID'}
                                        />
                                        <InputRightAddon
                                            children={'Verify'}
                                            cursor={'pointer'}
                                            onClick={() => verifyBeneficiary()}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </Stack>
                            {
                                fetchedUser.user_name ?
                                    <Stack
                                        p={4} bg={'blue.50'}
                                        border={'1px'}
                                        borderColor={'blue.200'}
                                        rounded={16}
                                        direction={['column', 'row']}
                                        spacing={6} justifyContent={'space-between'}
                                        textTransform={'capitalize'}
                                    >
                                        <Box>
                                            <Text fontWeight={'medium'}>Beneficiary Name</Text>
                                            <Text>{fetchedUser.user_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Firm Name</Text>
                                            <Text>{fetchedUser.firm_name}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Current Balance</Text>
                                            <Text>₹ {fetchedUser.wallet}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontWeight={'medium'}>Phone</Text>
                                            <Text>{fetchedUser.phone}</Text>
                                        </Box>
                                    </Stack> : null
                            }
                            <Stack
                                direction={['column', 'row']}
                                py={8} justifyContent={'space-between'}
                            >
                                <FormControl w={['full', 'xs']}>
                                    <FormLabel>Transaction Type</FormLabel>
                                    <Select
                                        name={'transactionType'}
                                        bg={'white'}
                                        onChange={Formik.handleChange}
                                    >
                                        <option value="transfer">Transfer</option>
                                        <option value="reversal">Reversal</option>
                                    </Select>
                                </FormControl>
                            </Stack>

                            <HStack justifyContent={'flex-end'}>
                                <Button
                                    type='submit'
                                    colorScheme={'twitter'}>Assign Package</Button>
                            </HStack>
                        </Box>
                    </Box>
                </Box>
            </Layout>
        </>
    )
}

export default Assign