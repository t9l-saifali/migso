import React, { useEffect, useState, useRef } from 'react';
import ReactLoading from 'react-loading';
const App = () => {
  const [allRead, setAllRead] = useState(false);
  const [allEdit, setAllEdit] = useState(false);
  const [newObj, setNewObj] = useState([]); 
  const [existField, setExistField] = useState([]); 
  const [isSpinner, setIsSpinner] = useState(false);
  const newObjRef = useRef(newObj);
  useEffect(()=>{
    window.addEventListener('message', receiveMessage, false);
  function receiveMessage(event) {
  const receivedData = event.data;
  console.log('Data received in iframe:', receivedData);
  if(receivedData?.salesforceData){
    if(JSON.parse(receivedData?.salesforceData)?.newObj){
      setNewObj(JSON.parse(receivedData?.salesforceData)?.newObj)
      setExistField(JSON.parse(receivedData?.salesforceData)?.existField)
    }
  }
  // else if(JSON.parse(receivedData?.salesforceData)?.deployClicked){
  //   const parentWindow = window.parent;
  //   parentWindow.postMessage({ from: 'iframe', newObj: newObj }, '*');
  // }
}
 
},[])
useEffect(() => {
  const receiveMessage = (event) => {
    const receivedData = event.data;
    if (receivedData?.salesforceData && JSON.parse(receivedData?.salesforceData)?.deployClicked) {
      console.log("Sending data to Salesforce");
      const parentWindow = window.parent;
      let arr = [];
      for (let p of newObjRef.current) {
        for (let r of p.fields) {
          arr.push({ ...r, profile: p.profile });
        }
      }
      parentWindow.postMessage({ from: 'iframe', newObj: arr }, '*');
    }
  };

  window.addEventListener('message', receiveMessage, false);

  // Cleanup function to remove the event listener when the component unmounts
  return () => {
    window.removeEventListener('message', receiveMessage, false);
  };
}, []);
useEffect(() => {
  newObjRef.current = newObj;
}, [newObj]);
  const newHandleAllRead = (event) => {
    try{
      let arr = newObj.map((cc)=>{
              let arr2 = cc.fields.map((cc2)=>{
                      return {
                           apiName:cc2.apiName,
                           read:event.target.checked,
                           edit:event.target.checked ? cc2.edit : false,
                           identifier:cc2.identifier
                      }
              })
          return {profile:cc.profile, fields:arr2, allRead:event.target.checked, allEdit:event.target.checked ? cc.allEdit : false}
         
      })
      setNewObj([...arr])
      setAllEdit(false)
      setAllRead(event.target.checked)
      let exitsarr = existField.map((cc)=>{
        return {
          ...cc,
          allEdit:event.target.checked ? cc.allEdit : false,
          allRead:event.target.checked
        }
      })
      setExistField([...exitsarr])
      }
      catch(err){
          console.log(err)
      }
  };

  const newHandleAllEdit = (event) => {
    try{
      let arr = newObj.map((cc)=>{
              let arr2 = cc.fields.map((cc2)=>{
                      return {
                           apiName:cc2.apiName,
                           read:event.target.checked ? event.target.checked : cc2.read,
                           edit:event.target.checked,
                           identifier:cc2.identifier
                      }
              })
          return {profile:cc.profile, fields:arr2, allRead:event.target.checked ? event.target.checked : cc.allRead, allEdit:event.target.checked}
         
      })
      setNewObj([...arr])
      setAllEdit(event.target.checked)
      setAllRead(event.target.checked ? event.target.checked : allRead)
      let exitsarr = existField.map((cc)=>{
        return {
          ...cc,
          allEdit:event.target.checked,
          allRead:event.target.checked ? event.target.checked : cc.allRead
        }
      })
      setExistField([...exitsarr])
      }
      catch(err){
          console.log(err)
      }
  };

  const newHandleReadRowWise = (event, selectedCheckbox) => {
    try {
      let SelectedProfile = selectedCheckbox.split('|')[0]
      let SelectedField = selectedCheckbox.split('|')[1]
      let arr = newObj.map(cc => {
        if (cc.profile == SelectedProfile) {
          let arr2 = cc.fields.map(cc2 => {
            if (cc2.apiName == SelectedField) {
              return {
                apiName: SelectedField,
                read: event.target.checked,
                edit: false,
                identifier: `${SelectedProfile}|${SelectedField}`
              }
            } else {
              return cc2
            }
          })
          return {
            profile: SelectedProfile,
            fields: arr2,
            allRead: arr2.every(ff => ff.read),
            allEdit: arr2.every(ff => ff.edit)
          }
        } else {
          return cc
        }
      })
      setNewObj([...arr])
      setAllEdit(arr.every(cc => cc.allEdit))
      setAllRead(arr.every(cc => cc.allRead))
      let exitsarr = existField.map((cc)=>{
            let arrrr= []
            for(let i of arr){
              arrrr.push(i.fields.find((ff)=>ff.apiName == cc.apiName))
            }
            return {
              ...cc,
              allEdit:arrrr.every((cc)=>cc.edit),
              allRead:arrrr.every((cc)=>cc.read)
            }
          })
          setExistField([...exitsarr])
    } catch (err) {
      console.log(err)
    }
  };

  const newHandleEditRowWise = (event, selectedCheckbox) => {
    try{
      let SelectedProfile = selectedCheckbox.split('|')[0]
      let SelectedField = selectedCheckbox.split('|')[1]
      let arr = newObj.map((cc)=>{
          if(cc.profile == SelectedProfile){
              let arr2 = cc.fields.map((cc2)=>{
                  if(cc2.apiName == SelectedField){
                      return {
                           apiName:SelectedField,
                           read:event.target.checked ? event.target.checked : cc2.read,
                           edit:event.target.checked,
                           identifier:`${SelectedProfile}|${SelectedField}`
                      }
                  } else {
                      return cc2
                  }
              })
              return {profile:SelectedProfile,fields:arr2, allRead:arr2.every((ff)=>ff.read), allEdit:arr2.every((ff)=>ff.edit)}
          } else {
              return cc
          }
      })
      setNewObj([...arr])
      setAllEdit(arr.every(cc => cc.allEdit))
      setAllRead(arr.every(cc => cc.allRead))
      let exitsarr = existField.map((cc)=>{
        let arrrr= []
        for(let i of arr){
          arrrr.push(i.fields.find((ff)=>ff.apiName == cc.apiName))
        }
        return {
          ...cc,
          allEdit:arrrr.every((cc)=>cc.edit),
          allRead:arrrr.every((cc)=>cc.read)
        }
      })
      setExistField([...exitsarr])
      }
      catch(err){
          console.log(err)
      }
  };
  const newHandleAllReadCoulouWise = (event, SelectedField) => {
    try{
      let fieldArr= existField.map((fi)=>{
          if(fi.apiName == SelectedField){
              return {
                  ...fi,
                  allRead:event.target.checked,
                  allEdit:event.target.checked ? fi.allEdit : false,
              }
          } else {
              return fi
          }
      })
      setExistField([...fieldArr])
  let arr = newObj.map((cc)=>{
          let arr2 = cc.fields.map((cc2)=>{
              if(cc2.apiName == SelectedField){
                  return {
                       apiName:SelectedField,
                       read:event.target.checked,
                       edit:event.target.checked ? cc2.edit : false,
                       identifier:cc2.identifier
                  }
              } else {
                  return cc2
              }
          })
          return {profile:cc.profile, fields:arr2, allRead:arr2.every((ff)=>ff.read), allEdit:event.target.checked ? cc.allEdit : false}
      
  })
  setNewObj([...arr])
  setAllEdit(event.target.checked ? allEdit : false)
  setAllRead(arr.every((cc)=>cc.allRead))
  }
  catch(err){
      console.log(err)
  }  };
  const newHandleAllEditCoulouWise = (event, SelectedField) => {
    try{
     let fieldArr= existField.map((fi)=>{
         if(fi.apiName == SelectedField){
             return {
                 ...fi,
                 allRead:event.target.checked ? event.target.checked : fi.allRead,
                 allEdit:event.target.checked,
             }
         } else {
             return fi
         }
     })
  setExistField([...fieldArr])
 let arr = newObj.map((cc)=>{
         let arr2 = cc.fields.map((cc2)=>{
             if(cc2.apiName == SelectedField){
                 return {
                      apiName:SelectedField,
                      read:event.target.checked ? event.target.checked : cc2.read,
                      edit:event.target.checked,
                      identifier:cc2.identifier
                 }
             } else {
                 return cc2
             }
         })
         return {profile:cc.profile, fields:arr2, allRead:arr2.every((ff)=>ff.read), allEdit:arr2.every((ff)=>ff.edit)}
     
 })
 setNewObj([...arr])
 setAllEdit(arr.every(cc => cc.allEdit))
 setAllRead(arr.every(cc => cc.allRead))
 }
 catch(err){
     console.log(err)
 }
  };
  const newHandleAllEditRowWise = (event, SelectedProfile) => {
    try{
     
      let arr = newObj.map((cc)=>{
          if(cc.profile == SelectedProfile){
              let arr2 = cc.fields.map((cc2)=>{
                      return {
                           apiName:cc2.apiName,
                           read:event.target.checked ? true : cc2.read,
                           edit:event.target.checked,
                           identifier:cc2.identifier
                      }
              })
              return {profile:SelectedProfile,fields:arr2, allRead:event.target.checked ? true : cc.allRead, allEdit:event.target.checked}
          } else {
              return cc
          }
      })
      setNewObj([...arr])
      setAllEdit(arr.every(cc => cc.allEdit))
      setAllRead(arr.every(cc => cc.allRead))
      let exitsarr = existField.map((cc)=>{
        let arrrr= []
        for(let i of arr){
          arrrr.push(i.fields.find((ff)=>ff.apiName == cc.apiName))
        }
        return {
          ...cc,
          allEdit:arrrr.every((cc)=>cc.edit),
          allRead:arrrr.every((cc)=>cc.read)
        }
      })
      setExistField([...exitsarr])
      }
      catch(err){
          console.log(err)
      }
  };
  const newHandleAllReadRowWise = (event, SelectedProfile) => {
    try{
  // let SelectedProfile = event.target.value;
  let arr = newObj.map((cc)=>{
      if(cc.profile == SelectedProfile){
          let arr2 = cc.fields.map((cc2)=>{
                  return {
                       apiName:cc2.apiName,
                       read:event.target.checked,
                       edit:event.target.checked ? cc2.edit : false,
                       identifier:cc2.identifier
                  }
          })
          return {profile:SelectedProfile,fields:arr2, allRead:event.target.checked, allEdit:event.target.checked ? cc.allEdit : false}
      } else {
          return cc
      }
  })
  setNewObj([...arr])
  setAllEdit(arr.every((cc)=>cc.allEdit))
  setAllRead(arr.every((cc)=>cc.allRead))

  let exitsarr = existField.map((cc)=>{
    let arrrr= []
    for(let i of arr){
      arrrr.push(i.fields.find((ff)=>ff.apiName == cc.apiName))
    }
    return {
      ...cc,
      allEdit:arrrr.every((cc)=>cc.edit),
      allRead:arrrr.every((cc)=>cc.read)
    }
  })
  setExistField([...exitsarr])
  }
  catch(err){
      console.log(err)
  }
  };

  return (
    <div className="table-design-bx migo-table-common">
    {newObj.length > 0 ? 
      <table className="slds-table slds-table_cell-buffer slds-table_bordered">
        <thead>
          <tr>
            <th>
              <div className="tbox-col">
              <p>&nbsp;</p>
                <span>
              Read All
                </span>
              <input
                type="checkbox"
                checked={allRead}
                onChange={newHandleAllRead}
              />
              </div>
            </th>
            <th>
            <div className="tbox-col">
              <p>&nbsp;</p>
                <span>
              Edit All
                </span>
              <input
                type="checkbox"
                checked={allEdit}
                onChange={newHandleAllEdit}
              />
              </div>
            </th>
            <th>Profiles</th>
            {existField.map((field, fieldIndex) => (
        <th colSpan="2" key={field.apiName}>
          <div className="data-edit-row">
            <p><span title={field.label}>{field.label}</span></p>
            <div className="edit-left-col">
              <span>Read</span>
              <input
                type="checkbox"
                data-colheaderread="checkHeader"
                data-readall="readAllSelected"
                data-input="ReadSelectedField"
                data-edit="editSelectAll"
                data-column={field.apiName}
                // name={rowObj1}
                variant="standard"
                value={field.apiName}
                onChange={(e) => newHandleAllReadCoulouWise(e, field.apiName)}
                checked={field.allRead}
              />
            </div>
            <div className="edit-right-col">
              <span>Edit</span>
              <input
                data-input="EditSelectedField"
                data-colheaderedit="checkHeader"
                data-edit="editSelectAll"
                data-column={field.apiName}
                // name={rowObj1}
                type="checkbox"
                variant="standard"
                value={field.apiName}
                onChange={(e) => newHandleAllEditCoulouWise(e,field.apiName)}
                checked={field.allEdit}
              />
            </div>
          </div>
        </th>
      ))}
          </tr>
        </thead>
        <tbody>
      {newObj.map((rowObj, profileIndex) => (
        <tr key={rowObj.profile}>
          <td>
            <input
              data-input="Read"
              data-readhead="profileWiseHeader"
              data-readall="readAllSelected"
              data-edit="editSelectAll"
              name={rowObj.profile}
              checked={rowObj.allRead}
              type="checkbox"
              variant="standard"
              value={rowObj.profile}
              onChange={(e) => newHandleAllReadRowWise(e,rowObj.profile)}
            />
          </td>
          <td>
            <input
              data-input="Edit"
              data-edithead="profileWiseHeader"
              data-edit="editSelectAll"
              name={rowObj.profile}
              checked={rowObj.allEdit}
              type="checkbox"
              variant="standard"
              value={rowObj.profile}
              onChange={(e) => newHandleAllEditRowWise(e, rowObj.profile)}
            />
          </td>
          <td>{rowObj.profile}</td>
          {rowObj.fields.map((rowObj1, index) => (
            <React.Fragment key={rowObj1.apiName}>
              <td>
                <input
                  data-input="Read"
                  data-allhead="readheadAll"
                  data-readall="readAllSelected"
                  data-edit="editSelectAll"
                  checked={rowObj1.read}
                  type="checkbox"
                  variant="standard"
                  value={rowObj1.identifier}
                  onChange={(e) => newHandleReadRowWise(e,rowObj1.identifier)}
                />
              </td>
              <td>
                <input
                  data-input="Edit"
                  data-edit="editSelectAll"
                  data-allhead="editheadAll"
                  checked={rowObj1.edit}
                  type="checkbox"
                  variant="standard"
                  value={rowObj1.identifier}
                  onChange={(e) => newHandleEditRowWise(e, rowObj1.identifier)}
                />
              </td>
            </React.Fragment>
          ))}
        </tr>
      ))}
    </tbody>
      </table> : <div className='loaderr'>
      <ReactLoading type={'balls'} color={'#56104F'} height={667} width={375} />
      </div>}
    </div>
  );
}; 

export default App;
