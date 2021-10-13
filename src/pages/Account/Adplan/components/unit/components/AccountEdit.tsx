import React, { useEffect, useState } from 'react';
import { Space, message, Image, Form, Button, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { mediaEdit, getCurrent, queryOption, getApp, getPeople, getLogo } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormRadio,
    ProFormDigit,
    ProFormDateRangePicker,
    ProFormTimePicker
} from '@ant-design/pro-form';
import moment from 'moment'
interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Formt: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [APPLogo, setAPPlogo] = useState<string>()
    const [logoVisible, setlogoVisible] = useState<boolean>(false)
    const [current, setcurrent] = useState<{
        name?: string;
        budget_all?: string;
        budget_day?: string;
        budget_tomorrow?: string;
        edate: string;
        sdate: string;
    }>()
    const [option, setoption] = useState<{
        plan?: any,
        ad_type?: any[],
        os?: any[],
        region?: any[],
        gender?: any[],
        network?: any[],
        passed_crowd?: any[],
        denied_crowd?: any[],
        passed_app?: any[],
        denied_app?: any[],
        logodata?: any[]
    }>({
        ad_type: [
            { label: '信息流列表页', value: 1 },
            { label: '开屏', value: 2 },
            { label: '横幅', value: 3 },
            { label: '激励视频', value: 4 },
        ],
        os: [
            { label: '不限', value: 0 },
            { label: '安卓', value: 1 },
            { label: 'IOS', value: 2 },
        ],
        region: ['不限', '西南', '华北', '华南', '东北', '华中', '西北', '东南', '华东'],
        gender: [
            { label: '不限', value: 0 },
            { label: '男', value: 1 },
            { label: '女', value: 2 },
        ],
        network: [
            { label: 'WIFI', value: 1 },
            { label: '2G', value: 2 },
            { label: '3G', value: 3 },
            { label: '4G', value: 4 },
            { label: '5G', value: 5 },
        ],
        passed_app: [],
        denied_app: [],
        passed_crowd: [],
        denied_crowd: [],
        logodata: [],
    })
    useEffect(() => {
        Select && getCurrent(Select).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
                setAPPlogo(res.data.content?.app_logo)
            }
        })
        setSelectOptions()
    }, [])
    const setSelectOptions = async () => {
        let allselect = await queryOption()
        let resapp = await getApp()
        let respeople = await getPeople()
        let resLogo = await getLogo()
        if (resapp.code === 1 && respeople.code === 1 && allselect.code === 1) {
            let reap = resapp.data?.map(((itm: any) => {
                return {
                    label: itm.name,
                    value: itm.id
                }
            }))
            let reppl = respeople.data?.map(((itm: any) => {
                return {
                    label: itm.title,
                    value: itm.id
                }
            }))
            let replogo = resLogo.data?.map(((itm: any) => {
                return {
                    label: itm.url,
                    value: itm.id
                }
            }))
            setoption({
                ...option, ...allselect.data, ...{ passed_app: reap }, ...{ denied_app: reap },
                ...{ passed_crowd: reppl }, ...{ denied_crowd: reppl }, ...{ logodata: replogo }
            })
        }
    }
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                plan_id: current?.ad_plan_id?.toString(),
                title: current?.name,
                ad_type: current?.ad_place_type || 1,
                passed_app: current?.cond_passed_app,
                denied_app: current?.cond_denied_app,
                os: current?.cond_os || 0,
                gender: current?.cond_gender || 0,
                region: current?.cond_region,
                network: current?.cond_network,
                passed_crowd: current?.cond_passed_crowd,
                denied_crowd: current?.cond_denied_crowd,
                app_title: current?.content?.app_title,
                app_name: current?.content?.app_name,
                app_down_addr: current?.content?.app_down_addr,
                action_type: current?.content?.action_type && Number(current?.content?.action_type),
                page_addr: current?.content?.page_addr,
                apply_addr: current?.content?.apply_addr,
                show_addr: current?.content?.show_addr,
                click_addr: current?.content?.click_addr,
                budget: current?.budget_all ? 1 : 0,
                budgetall: current?.budget_all,
                budgetday: current?.budget_day,
                cost_type: current?.cost_type,
                cost_value: current?.cost_value,
                adddate: current?.started_at ? 1 : 0,
                dateplan: current && current?.started_at ? [current.started_at && moment(current.started_at * 1000).format('yyyy-MM-DD') || '', moment(current && current.stopped_at * 1000).format('yyyy-MM-DD') || ''] : null,
                addtime: current?.started_hour ? 1 : 0,
                shour: current?.started_hour ? moment(current?.started_hour, 'HH:mm:ss') : null,
                ehour: current?.stopped_hour ? moment(current?.stopped_hour, 'HH:mm:ss') : null,
                addrate: (current?.frequency_show || current?.frequency_click) ? 1 : 0,
                show_times: current?.frequency_show,
                click_times: current?.frequency_click
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑单元' : '添加单元'}
            width={700}
            style={{ maxHeight: 500 }}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                let form = new FormData()
                form.append('id', Select || '')
                form.append('title', values.title || '')
                form.append('sdate', values.dateplan?.[0] || '')
                form.append('edate', values.dateplan?.[1] || '')
                form.append('plan_id', values.plan_id || '')
                form.append('ad_type', values.ad_type || '')
                form.append('os', values.os || '')
                form.append('region', values.region || '')
                form.append('gender', values.gender || '')
                form.append('network', values.network || '')
                form.append('app_logo', APPLogo || values.file?.[0]?.originFileObj)
                form.append('app_name', values.app_name || '')
                form.append('app_title', values.app_title || '')
                form.append('app_down_addr', values.app_down_addr || '')
                form.append('action_type', values.action_type || '')
                form.append('page_addr', values.page_addr || '')
                form.append('apply_addr', values.apply_addr || '')
                form.append('show_addr', values.show_addr || '')
                form.append('click_addr', values.click_addr || '')
                form.append('budgetday', values.budgetday || '')
                form.append('budgetall', values.budgetall || '')
                form.append('cost_type', values.cost_type || '')
                form.append('cost_value', values.cost_value || '')
                form.append('shour', values.shour || '')
                form.append('ehour', values.ehour || '')
                form.append('show_times', values.show_times || '')
                form.append('click_times', values.click_times || '')
                form.append('passed_app', values.passed_app || '')
                form.append('denied_app', values.denied_app || '')
                form.append('passed_crowd', values.passed_crowd || '')
                form.append('denied_crowd', values.denied_crowd || '')
                console.log(form)

                let res = await mediaEdit(form);
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormSelect
                width="md"
                name="plan_id"
                label="选择计划"
                valueEnum={option?.plan}
                rules={[
                    {
                        required: true,
                        message: '选择计划是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="title"
                label="单元标题"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '单元标题是必填项！'
                    }
                ]}
            />
            <ProFormRadio.Group
                width="md"
                name="ad_type"
                label="广告类型"
                options={option?.ad_type}
                rules={[
                    {
                        required: true,
                        message: '单元标题是必填项！'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="passed_app"
                label="指定app"
                mode='multiple'
                options={option?.passed_app}
            />
            <ProFormSelect
                width="md"
                name="denied_app"
                label="排除app"
                mode='multiple'
                options={option?.denied_app}
            />
            <ProFormRadio.Group
                label="操作系统"
                name='os'
                options={option?.os}
            />
            <ProFormSelect
                width="md"
                name="region"
                label="地域"
                mode='multiple'
                options={option?.region}
            />
            <ProFormRadio.Group
                width="md"
                name="gender"
                label="性别"
                options={option?.gender}
            />
            <ProFormCheckbox.Group
                width="md"
                name="network"
                label="网络"
                options={option?.network}
            />
            <ProFormSelect
                width="md"
                name="passed_crowd"
                label="投放人群包"
                mode='multiple'
                options={option?.passed_crowd}
            />
            <ProFormSelect
                width="md"
                name="denied_crowd"
                label="排除人群包"
                mode='multiple'
                options={option?.denied_crowd}
            />
            {!APPLogo ? <ProFormUploadButton
                name="file"
                label="APP logo"
                max={1}
                fieldProps={{
                    name: 'file',
                    listType: 'picture-card'
                }}
                rules={[
                    {
                        required: true,
                        message: 'APP logo是必传项！'
                    }
                ]}
                action={''}
                extra="请上传小于4M的png/jpg格式的图片"
            /> : null}
            {!APPLogo ? <Form.Item label="素材库" valuePropName="checked">
                <Popover
                    content={(
                        <div style={{ width: 500, maxHeight: 500 }}>
                            <Space size={[8, 16]} wrap align='center'>
                                {option?.logodata?.map((itm) => (
                                    <Image
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setAPPlogo(itm.label)
                                            setlogoVisible(false)
                                        }}
                                        preview={false}
                                        key={itm.value}
                                        height={125}
                                        width={120}
                                        src={itm.label}
                                    />
                                ))}
                            </Space>
                        </div>
                    )}
                    trigger="click"
                    visible={logoVisible}
                    onVisibleChange={(value) => {
                        setlogoVisible(value)
                    }}
                >
                    <Button>点击选择</Button>
                </Popover>

            </Form.Item> : null}
            {APPLogo ? <Form.Item label="APP logo" valuePropName="checked">
                <Image
                    preview={false}
                    height={125}
                    src={APPLogo}
                ></Image>
                <DeleteOutlined onClick={() => {
                    setAPPlogo('')
                }} style={{ fontSize: 16, cursor: 'pointer', marginLeft: 5 }} />
            </Form.Item> : null}
            <ProFormText
                width="md"
                name="app_title"
                label="APP名称"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP名称是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="app_name"
                label="APP包名"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP包名是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="app_down_addr"
                label="APP下载地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: 'APP下载地址是必填项！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormSelect
                width="md"
                name="action_type"
                label="行动感召"
                options={[
                    { label: '立即下载', value: 1 },
                    { label: '打开应用', value: 2 }
                ]}
                rules={[
                    {
                        required: true,
                        message: '行动感召是必填项！'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="page_addr"
                label="落地页地址"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '落地页地址是必填项！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="apply_addr"
                label="应用直达链接"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '应用直达链接是必填项！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="show_addr"
                label="曝光监测"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '曝光监测是必填项！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormText
                width="md"
                name="click_addr"
                label="点击监测"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '点击监测是必填项！'
                    },
                    {
                        pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
                        message: '请输入正确的url地址（以http://或https://开头）'
                    }
                ]}
            />
            <ProFormRadio.Group
                label="广告预算"
                name='budget'
                options={[
                    { label: '随计划控制', value: 0 },
                    { label: '指定', value: 1 },
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("budget")
                    return (re ?
                        <>
                            <ProFormDigit
                                width="md"
                                name="budgetall"
                                label="总预算"
                                placeholder="请输入"
                                min={1}
                                rules={[
                                    {
                                        required: true,
                                        message: '总预算是必填项！'
                                    }
                                ]}
                            />
                            <ProFormDigit
                                width="md"
                                name="budgetday"
                                label="每日预算"
                                placeholder="请输入"
                                min={1}
                                rules={[
                                    {
                                        required: true,
                                        message: '每日预算是必填项！'
                                    }
                                ]}
                            />
                        </> : null
                    );
                }}
            </ProForm.Item>
            <ProFormRadio.Group
                label="计费方式"
                name='cost_type'
                options={[
                    { label: 'cpm', value: 1 },
                    { label: 'cpc', value: 2 },
                ]}
                rules={[
                    {
                        required: true,
                        message: '计费方式是必填项！'
                    }
                ]}
            />
            <ProFormDigit
                width="md"
                name="cost_value"
                label="出价"
                placeholder="请输入"
                min={1}
                rules={[
                    {
                        required: true,
                        message: '出价是必填项！'
                    }
                ]}
            />
            <ProFormRadio.Group
                label="投放日期"
                name='adddate'
                options={[
                    { label: '随计划控制', value: 0 },
                    { label: '指定', value: 1 },
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("adddate")
                    return (re ?
                        <>
                            <ProFormDateRangePicker
                                width="md"
                                name="dateplan"
                                label="投放日期"
                                rules={[
                                    {
                                        required: true,
                                        message: '投放日期是必填项！'
                                    }
                                ]}
                            />
                        </> : null
                    );
                }}
            </ProForm.Item>
            <ProFormRadio.Group
                label="投放时间"
                name='addtime'
                options={[
                    { label: '随计划控制', value: 0 },
                    { label: '指定', value: 1 },
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("addtime")
                    return (re ?
                        <>
                            <ProFormTimePicker
                                width="md"
                                name="shour"
                                label="开始时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '开始时间是必填项！'
                                    }
                                ]}
                            />
                            <ProFormTimePicker
                                width="md"
                                name="ehour"
                                label="结束时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '结束时间是必填项！'
                                    }
                                ]}
                            />
                        </> : null
                    );
                }}
            </ProForm.Item>
            <ProFormRadio.Group
                label="投放频次"
                name='addrate'
                options={[
                    { label: '随计划控制', value: 0 },
                    { label: '指定', value: 1 },
                ]}
            />
            <ProForm.Item noStyle shouldUpdate>
                {(form) => {
                    let re = form.getFieldValue("addrate")
                    return (re ?
                        <>
                            <ProFormDigit
                                width="md"
                                name="show_times"
                                label="曝光频次"
                                placeholder="请输入"
                                min={1}
                                rules={[
                                    {
                                        required: true,
                                        message: '曝光频次是必填项！'
                                    }
                                ]}
                            />
                            <ProFormDigit
                                width="md"
                                name="click_times"
                                label="点击频次"
                                placeholder="请输入"
                                min={1}
                                rules={[
                                    {
                                        required: true,
                                        message: '点击频次是必填项！'
                                    }
                                ]}
                            />
                        </> : null
                    );
                }}
            </ProForm.Item>
        </ModalForm> : null
    );
};
export default Formt