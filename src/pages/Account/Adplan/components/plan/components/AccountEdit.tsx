import React, { useEffect, useState } from 'react';
import { Alert, message, Image } from 'antd';
import { mediaEdit, getCurrent, getIndustry } from './../request'
import ProForm, {
    ModalForm,
    ProFormText,
    ProFormSelect,
    ProFormUploadButton,
    ProFormCheckbox,
    ProFormDigit,
    ProFormDateRangePicker
} from '@ant-design/pro-form';
import moment from 'moment'
interface FormParams {
    onCancel: () => void;
    Select: string | undefined;
    reload: () => void;
}
const Form: React.FC<FormParams> = (props) => {
    const { onCancel, Select, reload } = props
    const [current, setcurrent] = useState<{
        name?: string;
        budget_all?: string;
        budget_day?: string;
        budget_tomorrow?: string;
        edate: string;
        sdate: string;
    }>()
    useEffect(() => {
        Select && getCurrent(Select).then(res => {
            if (res.code === 1) {
                setcurrent(res.data)
            }
        })
    }, [])
    return (
        (Select ? current?.name ? true : false : true) ? <ModalForm<any> {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }}
            initialValues={{
                name: current?.name,
                budgetall: current?.budget_all,
                dateplan: current ? [current && moment(current.sdate * 1000).format('yyyy-MM-DD'), moment(current && current.edate * 1000).format('yyyy-MM-DD')] : null,
                budgetday: current?.budget_day,
                budgettomorrow: current?.budget_tomorrow,
            }}
            layout={'horizontal'}
            visible={true}
            title={Select ? '编辑计划' : '添加计划'}
            width={600}
            modalProps={{
                onCancel: () => onCancel()
            }}
            onFinish={async (values) => {
                let form = new FormData()
                form.append('title', values.name)
                form.append('sdate', values.dateplan[0])
                form.append('edate', values.dateplan[1])
                form.append('budgetall', values.budgetall)
                form.append('budgetday', values.budgetday)
                form.append('budgettomorrow', values.budgettomorrow || '')
                form.append('id', Select || '')
                let res = await mediaEdit(form);
                if (res.code === 1) {
                    message.success(res.msg);
                    reload()
                    onCancel()
                    return true;
                }
            }}
        >
            <ProFormText
                width="md"
                name="name"
                label="计划标题"
                placeholder="请输入"
                rules={[
                    {
                        required: true,
                        message: '计划标题是必填项！'
                    }
                ]}
            />
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
            <ProFormDigit
                width="md"
                name="budgettomorrow"
                label="明日预算"
                placeholder="请输入"
                min={1}
            />
        </ModalForm> : null
    );
};
export default Form