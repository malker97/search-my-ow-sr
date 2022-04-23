import SearchBar from "material-ui-search-bar";
import React, { useState } from "react";
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {columns} from './datagriddata';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
// Goodok#31117 测试用ID
// 测试用API接口
// http://owapi.io/profile/pc/us/Goodok-31117

const MySearchBar = (props) => {
    var [accountID, setAccountID] = useState('');
    const [rows,setRows] = useState([]);
    const [ids,setIDs] = useState([]);
    const [errorMsg, setErrormsg] = useState('');
    const [errorTitle, setErrortitle] = useState('');
    const [severitytype, setSeveritytype] = useState('');
    function searchAccount(){
        // setAccountID(accountID.replace(/\s/g, ''));
        accountID = accountID.replace(/\s/g, '');
        const id = accountID.replace('#','-');
        console.log(id);
        axios.get(`http://owapi.io/profile/pc/us/${id}`)
        .then(res => {
          console.log(res.status);
          const account = res.data;
          console.log(account);
          var count = Object.keys(account).length;
          const ranks = {id: '', tank: '', dps: '',support:''}
          if(count > 1){
            ranks.id= accountID;
            ranks.tank = account['competitive']['tank']['rank'];
            ranks.dps = account['competitive']['damage']['rank'];
            ranks.support = account['competitive']['support']['rank'];
            if(ids.indexOf(accountID) === -1){
                setRows( arr => [...arr, ranks]);
                setIDs(arr => [...arr, accountID]);
                setSeveritytype("success");
                setErrortitle("Success");
                setErrormsg("");   
            }
            else{
                setSeveritytype("info");
                setErrortitle("Info");
                setErrormsg("Account has been searched");
            }
            setAccountID("");
          }
          else{
            setSeveritytype("error");
            setErrortitle("Error");
            setErrormsg("Cant view this account profile or This Account is not exist");
            console.log("Cant view this account Profile");
          }
        })
    }
    return (
        <div>
            <div style={{ height: 200, width: '100%' }}></div>
            <SearchBar
            value={accountID}
            onChange={(newValue) => setAccountID( newValue )}
            onRequestSearch={searchAccount}
            style={{
            margin: "0 auto",
            maxWidth: 800
            }}
            />
            <div style={{ height: 50, width: '100%' }}></div>
            <Stack sx={{ width: '100%' }} style={{alignItems: 'center'}} spacing={2}>
                <Alert severity={severitytype}>
                    <AlertTitle>{errorTitle}</AlertTitle>
                    {errorMsg}
                </Alert>
            </Stack>

            <div style={{ height: 50, width: '100%' }}></div>
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={rows}
            columns={columns}
            autoPageSize={true}
            checkboxSelection
            disableSelectionOnClick
            />
            </div>
        </div>
        
    );

};

export default MySearchBar;
