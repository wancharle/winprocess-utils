'use strict';
var scan = require('./winprocess');
//console.log('Hello', scan.hello("World of Warcraft",new Buffer("ABC")));
function teste(){
	var VARIAVEL = "TESTEVAR==!!!"

	console.log("\n\n======== TESTE LOCAL =========")
	var teste1 = new scan.Process(process.pid)
	teste1.open()
	//var endereco = 0x153E0010
	var endereco = teste1.scanBuffer(new Buffer("TESTEVAR"))
	//wow.writeMemory(endereco+8, new Buffer("ccc"));
	var i;
	var memBuffer = teste1.readMemory(endereco, 13);
	var lido=memBuffer.toString()
	console.log("<",lido,">")
	if (lido =="TESTEVAR==!!!"){console.log('leitura: ok!\n')}
	//teste1.writeMemory(endereco, new Buffer("FIM TESTE"));

	memBuffer = teste1.readMemory(endereco, 13);
	lido=memBuffer.toString()
	console.log("<",lido,">")

	if (lido =="FIM TESTE=!!!"){console.log('escrita: ok!\n')}
	
	teste1.close()

}
//teste()
function wow(){
var pid = scan.getProcessIdByWindow("World of Warcraft")
	console.log("Process ID=",pid)
	var teste2 = new scan.Process(pid)
	teste2.open()
	var endereco = teste2.scanDouble(2863311531)
	console.log('search1',endereco)
	var endereco = teste2.scanDoubleList(16,2863311531,86331153,633115,3311)
	console.log('search2',endereco)
	var valor = teste2.readDouble(endereco+16*3);
	console.log('valor=',valor, teste2.readDouble(endereco+16*4), teste2.readDouble(endereco+16*5),teste2.readDouble(endereco+16*6))
	teste2.writeDouble(endereco+16*5,-1)
	for (var i=1;i<100;i++){
	var nums = teste2.readNumeros(endereco,4000);
	nums[7] = 10;
	nums[3998] = i;
	teste2.writeNumeros(endereco,nums);
	console.log(teste2.readNumeros(endereco,4000)[3998]);
	}

	var nums = teste2.readNumeros(endereco,5);
	console.log(nums);
	teste2.close()
	
}
///wow()


function playerbase(){
var pid = scan.getProcessIdByWindow("World of Warcraft")
	console.log("Process ID=",pid)
	var teste2 = new scan.Process(pid)
	teste2.open()
    var posx = 453

	//var endereco = teste2.scanDouble(2863311531)
	
	//;var endereco = teste2.scanDoubleList(16,posx)
	//var text = teste2.readMemory(0x9c743a,4)

	//console.log('search1',endereco)
	//console.log('search1',text.toString())
    	console.log(teste2.readMemory(0x142b1dd4,8));
	//teste2.writeMemory(0x9c743a,new Buffer(String.fromCharCode(65)));
	//var text = teste2.readMemory(0x833a44,4)
	//console.log('search1',text.toString())
	//var endereco = teste2.scanDoubleList(16,2863311531,86331153,633115,3311)
	//console.log('search2',endereco)
	//var valor = teste2.readDouble(endereco+16*3);
	teste2.close()
	
}

function getScanWow(){
    var pid = scan.getProcessIdByWindow("World of Warcraft")
	console.log("Process ID=",pid)
	return new scan.Process(pid)
}
//playerbase()
//
function getPlayerRotation(){
    var proc  = getScanWow()
    proc.open()
    var rotacao = proc.readFloat(0x00CE9B90)
    proc.close()
    return rotacao
}

function getPlayerName(){
    var proc  = getScanWow()
    proc.open()
    var name = proc.readMemory(0x827D88,5)
    proc.close()
    return name.toString()
}

function GetLocalGuid(){

    var LocalPlayerGUID = 0x741e30
    var proc  = getScanWow()
    proc.open()
    var guid = proc.readUint64(0x400000+LocalPlayerGUID)
    proc.close()
    return guid
}

var Constants = {
        /* 
         * This Constants are from Cataclysm. 
         * Don't know if all of them are correct,
         * but the needed ones are working for 1.12.1
         */
        ObjType : {
            OT_NONE : 0,
            OT_ITEM : 1,
            OT_CONTAINER : 2,
            OT_UNIT : 3,
            OT_PLAYER : 4,
            OT_GAMEOBJ : 5,
            OT_DYNOBJ : 6,
            OT_CORPSE : 7,
            OT_FORCEDWORD : 0xFFFFFFFF
        },

        GameObjectType : {
            Door : 0,
            Button : 1,
            QuestGiver : 2,
            Chest : 3,
            Binder : 4,
            Generic : 5,
            Trap : 6,
            Chair : 7,
            SpellFocus : 8,
            Text : 9,
            Goober : 0xa,
            Transport : 0xb,
            AreaDamage : 0xc,
            Camera : 0xd,
            WorldObj : 0xe,
            MapObjTransport : 0xf,
            DuelArbiter : 0x10,
            FishingNode : 0x11,
            Ritual : 0x12,
            Mailbox : 0x13,
            AuctionHouse : 0x14,
            SpellCaster : 0x16,
            MeetingStone : 0x17,
            Unkown18 : 0x18,
            FishingPool : 0x19,
            FORCEDWORD : 0xFFFFFFFF,
        }
}
var Descriptors = 
    {
    /// <summary>
    ///    1.12.1.5875
    /// </summary>
     WoWUnitFields:
    {
        Charm : 0x18 / 4,
        Summon : 0x20 / 4,
        CharmedBy : 0x28 / 4,
        SummonedBy : 0x30 / 4,
        CreatedBy : 0x38 / 4,
        Target : 0x40 / 4,
        ChannelObject : 0x50 / 4,
        Health : 0x58 / 4,
        Power : 0x5c / 4,
        MaxHealth : 0x70 / 4,
        MaxPower : 0x74 / 4,
        Level : 0x88 / 4,
    }
}
var Pointers = {
    StaticPointers : {
        CurrentTargetGUID : 0x74e2d8,
        LocalPlayerGUID : 0x741e30
    },
    ObjectManager: {
        CurMgrPointer : 0x00741414,
        CurMgrOffset : 0xAC,
        NextObject : 0x3c,
        FirstObject : 0xAC,
        LocalGUID : 0xC0
    },
    WowObject : {
        DataPTR : 0x8,
        Type : 0x14,
        Guid : 0x30, 
        Y : 0x9b8, 
        X : 0x9b8 + 0x4,
        Z : 0x9b8 + 0x8, 
        RotationOffset : 0x9b8 + 0x8 +0x4,  // This seems to be wrong
        GameObjectY : 0x2C4, // *DataPTR (0x288) + 0x3c
        GameObjectX : 0x2C4 + 0x4, 
        GameObjectZ : 0x2C4 + 0x8,
        Speed : 0xA34
    },
    UnitName : {
        ObjectName1 : 0x214, //pointing to itemtype of objectdescription
        ItemType : 0x2DC, // *DataPTR (0x288) + 0x54
        ObjectName2 : 0x8,
        UnitName1 : 0xB30, 
        UnitName2 : 0x0,

        PlayerNameCachePointer : 0x80E230, 
        PlayerNameGUIDOffset : 0xc,
        PlayerNameStringOffset : 0x14
    }
}

function WowObject (){
    // general properties
    this.Guid = 0;
    this.SummonedBy = 0;
    this.XPos = 0;
    this.YPos = 0;
    this.ZPos = 0;
    this.Rotation = 0;
    this.BaseAddress = 0;
    this.UnitFieldsAddress = 0;
    this.Type = 0;
    this.Name = "";

    // more specialised properties (player or mob)
    this.CurrentHealth = 0;
    this.MaxHealth = 0;
    this.CurrentEnergy = 0; // mana, rage and energy will all fall under energy.
    this.MaxEnergy = 0;
    this.Level = 0;

    this.GameObjectType = 0;
    this.next = null;     
}

function GameReader(){
    var LocalPlayer = new WowObject()
    var LocalTarget = new WowObject()
    var CurrentObject = new WowObject()
    var ClientConnection = 0;
    var FirstObject = 0;
    var FirstObjectOffset = Pointers.ObjectManager.FirstObject;
    var TotalWowObjects = 0;

    var WowReader = getScanWow() 
    WowReader.open()

    var BaseAddress = WowReader.getBaseAddress("WoW.exe");
    console.log("BASE:",BaseAddress);
    var StaticClientConnection ;

    var CurrentTargetGUID ;

    function init(){
    /*
        StaticClientConnection = BaseAddress + Pointers.ObjectManager.CurMgrPointer;
        CurrentTargetGUID = BaseAddress + Pointers.StaticPointers.CurrentTargetGUID;
        WowReader.open()
        LoadAddresses()
        var p=     getLocalPlayer()
        console.log(p);
        console.log(getLocalTarget());
        console.log(getAllObjects());
*/

    }

    this.init = init;

    
    function ReadASCIIString(addr)
    {
        var buffer = WowReader.readMemory(addr, 50);
        var string = ""
        for (var i =0; i<50;i++)
        {
            if (buffer[i]==0)
                return string;
            string += String.fromCharCode(buffer[i])
        }
        return  string;
    }

    function MobNameFromGuid(Guid){
        var ObjectBase = GetObjectBaseByGuid(Guid)
        return ReadASCIIString(WowReader.ReadUInt(WowReader.ReadUInt(ObjectBase + Pointers.UnitName.UnitName1) + Pointers.UnitName.UnitName2));
    }
    
    function MobNameFromBaseAddr(BaseAddr)
    {
        var  ObjectBase = BaseAddr;
        return ReadASCIIString((WowReader.ReadUInt((WowReader.ReadUInt((ObjectBase + Pointers.UnitName.UnitName1)) + Pointers.UnitName.UnitName2))));
    }

    function PlayerNameFromGuid(guid){
        var nameStorePtr = BaseAddress + Pointers.UnitName.PlayerNameCachePointer; // Player name database
        var base_, testGUID;

        base_ = WowReader.ReadUInt(nameStorePtr);
        testGUID = WowReader.ReadUInt64(base_ + Pointers.UnitName.PlayerNameGUIDOffset);

        while (testGUID != guid)
        {
            //read next
            base_ = WowReader.ReadUInt(base_);
            testGUID = WowReader.ReadUInt64(base_ + Pointers.UnitName.PlayerNameGUIDOffset);
        }

        // Hopefully found the guid in the name list...
        // I don't know how to check for not found
        return ReadASCIIString(base_ + Pointers.UnitName.PlayerNameStringOffset);
    }

    function ItemNameFromGuid(Guid){
        var ObjectBase = GetObjectBaseByGuid(Guid);
        return ReadASCIIString((WowReader.ReadUInt((WowReader.ReadUInt((ObjectBase + Pointers.UnitName.ObjectName1)) + Pointers.UnitName.ObjectName2))));
    }

    function ItemNameFromBaseAddr(BaseAddr){
        var ObjectBase = BaseAddr;
        return ReadASCIIString((WowReader.ReadUInt((WowReader.ReadUInt((ObjectBase + Pointers.UnitName.ObjectName1)) + Pointers.UnitName.ObjectName2))));
    }

    function ItemTypeFromBaseAddr(BaseAddr){
        var ObjectBase = BaseAddr;
        return WowReader.ReadUInt((ObjectBase + Pointers.UnitName.ItemType));
    }

    function GetObjectBaseByGuid(Guid){
        var TempObject = new WowObject();
        // set the current object to the first object in the object manager
        TempObject.BaseAddress = FirstObject;
        // while the base address of the current object is not 0, find the guid
        // and compare it to the one passed in. if it matches, return that base
        // address, otherwise continue looking
        while (TempObject.BaseAddress != 0)
        {
            try
            {
                TempObject.Guid = WowReader.ReadUInt64((TempObject.BaseAddress + Pointers.WowObject.Guid));
                if (TempObject.Guid == Guid)
                    return TempObject.BaseAddress;
                TempObject.BaseAddress = WowReader.ReadUInt((TempObject.BaseAddress + Pointers.ObjectManager.NextObject));
            }
            catch (err)
            {
            }
        }
        // if we reached here it means we couldn't find the Guid we were looking for, return 0
        return 0;
    }
    function GetObjectGuidByBase(Base){
            return WowReader.ReadUInt64(Base + Pointers.WowObject.Guid);
    }

    function LoadAddresses(){           
        ClientConnection = WowReader.ReadUInt((StaticClientConnection));
        FirstObject = WowReader.ReadUInt((ClientConnection + FirstObjectOffset));
        LocalPlayer.Guid = WowReader.ReadUInt64(BaseAddress + Pointers.StaticPointers.LocalPlayerGUID);
        if (LocalPlayer.Guid == 0)
            return false;
        else
            return true;
    }

    function getLocalPlayer()   {
        LocalPlayer.BaseAddress = GetObjectBaseByGuid(LocalPlayer.Guid);
        LocalPlayer.XPos = WowReader.ReadFloat((LocalPlayer.BaseAddress + Pointers.WowObject.X)); 
        LocalPlayer.YPos = WowReader.ReadFloat((LocalPlayer.BaseAddress + Pointers.WowObject.Y)); 
        LocalPlayer.ZPos = WowReader.ReadFloat((LocalPlayer.BaseAddress + Pointers.WowObject.Z)); 
        LocalPlayer.Rotation = WowReader.ReadFloat((LocalPlayer.BaseAddress + Pointers.WowObject.RotationOffset)); 
        LocalPlayer.Name = PlayerNameFromGuid(LocalPlayer.Guid);           
        LocalPlayer.UnitFieldsAddress = WowReader.ReadUInt((LocalPlayer.BaseAddress + Pointers.WowObject.DataPTR));
        LocalPlayer.CurrentHealth = WowReader.ReadUInt((LocalPlayer.UnitFieldsAddress + Descriptors.WoWUnitFields.Health * 4));
        LocalPlayer.MaxHealth = WowReader.ReadUInt((LocalPlayer.UnitFieldsAddress + Descriptors.WoWUnitFields.MaxHealth * 4));
        LocalPlayer.Level = WowReader.ReadUInt((LocalPlayer.UnitFieldsAddress + Descriptors.WoWUnitFields.Level * 4));
        return LocalPlayer;
    }

    function getLocalTarget(){
        LocalTarget.Guid = WowReader.ReadUInt64((CurrentTargetGUID));
        // if we actually have a target
        if (LocalTarget.Guid != 0)
        {
            LocalTarget.BaseAddress = GetObjectBaseByGuid(LocalTarget.Guid);
            LocalTarget.XPos = WowReader.ReadFloat((LocalTarget.BaseAddress + Pointers.WowObject.X)); 
            LocalTarget.YPos = WowReader.ReadFloat((LocalTarget.BaseAddress + Pointers.WowObject.Y)); 
            LocalTarget.ZPos = WowReader.ReadFloat((LocalTarget.BaseAddress + Pointers.WowObject.Z)); 
            LocalTarget.Type = WowReader.ReadUInt((LocalTarget.BaseAddress + Pointers.WowObject.Type));
            LocalTarget.Rotation = WowReader.ReadFloat((LocalTarget.BaseAddress + Pointers.WowObject.RotationOffset));
            LocalTarget.UnitFieldsAddress = WowReader.ReadUInt((LocalTarget.BaseAddress + Pointers.WowObject.DataPTR));
            LocalTarget.CurrentHealth = WowReader.ReadUInt((LocalTarget.UnitFieldsAddress + Descriptors.WoWUnitFields.Health * 4));
            LocalTarget.MaxHealth = WowReader.ReadUInt((LocalTarget.UnitFieldsAddress + Descriptors.WoWUnitFields.MaxHealth * 4));
            LocalTarget.Level = WowReader.ReadUInt((LocalTarget.UnitFieldsAddress + Descriptors.WoWUnitFields.Level * 4));
            LocalTarget.SummonedBy = WowReader.ReadUInt64((LocalTarget.UnitFieldsAddress + Descriptors.WoWUnitFields.SummonedBy * 4));

            // get the name of our target
            if (LocalTarget.Type == 3) // not a human player
                LocalTarget.Name = MobNameFromGuid(LocalTarget.Guid);
            if (LocalTarget.Type == 4) // a human player
                LocalTarget.Name = PlayerNameFromGuid(LocalTarget.Guid);


            // return target
            return LocalTarget;
        }
        else
        {
            return null;
        }
    }

    function getAllObjects(){
        // set our counter variable to 0 so we can begin counting the objects
        TotalWowObjects = 0;
        CurrentObject = new WowObject();
        // set our current object as the first in the object manager
        CurrentObject.BaseAddress = FirstObject;
        var list = new Array();
        // set our current object as the first in the object manager
        CurrentObject.BaseAddress = FirstObject;
        // read the object manager from first object to last.
        while (CurrentObject.BaseAddress != 0 && CurrentObject.BaseAddress % 2 == 0)
        {
            // add to our counter
            TotalWowObjects = TotalWowObjects + 1;

            // type independent informations
            CurrentObject.Guid = WowReader.ReadUInt64(CurrentObject.BaseAddress + Pointers.WowObject.Guid);
            CurrentObject.Type = WowReader.ReadUInt(CurrentObject.BaseAddress + Pointers.WowObject.Type);

           
                switch (CurrentObject.Type)
                {
                    case Constants.ObjType.OT_UNIT: // an npc
                        CurrentObject.UnitFieldsAddress = WowReader.ReadUInt(CurrentObject.BaseAddress + Pointers.WowObject.DataPTR);
                        CurrentObject.CurrentHealth = WowReader.ReadUInt(CurrentObject.UnitFieldsAddress + Descriptors.WoWUnitFields.Health * 4);
                        CurrentObject.MaxHealth = WowReader.ReadUInt(CurrentObject.UnitFieldsAddress + Descriptors.WoWUnitFields.MaxHealth * 4);
                        CurrentObject.SummonedBy = WowReader.ReadUInt64(CurrentObject.UnitFieldsAddress + Descriptors.WoWUnitFields.SummonedBy * 4);
                        CurrentObject.XPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.X); 
                        CurrentObject.YPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.Y); 
                        CurrentObject.ZPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.Z); 
                        CurrentObject.Rotation = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.RotationOffset); 
                        CurrentObject.Name = MobNameFromBaseAddr(CurrentObject.BaseAddress);
                        break;
                    case Constants.ObjType.OT_PLAYER: // a player
                        CurrentObject.UnitFieldsAddress = WowReader.ReadUInt(CurrentObject.BaseAddress + Pointers.WowObject.DataPTR);
                        CurrentObject.CurrentHealth = WowReader.ReadUInt(CurrentObject.UnitFieldsAddress + Descriptors.WoWUnitFields.Health * 4);
                        CurrentObject.MaxHealth = WowReader.ReadUInt(CurrentObject.UnitFieldsAddress + Descriptors.WoWUnitFields.MaxHealth * 4);
                        CurrentObject.XPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.X); 
                        CurrentObject.YPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.Y); 
                        CurrentObject.ZPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.Z); 
                        CurrentObject.Rotation = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.RotationOffset); 
                        CurrentObject.Name = PlayerNameFromGuid(CurrentObject.Guid);
                        break;
                    case Constants.ObjType.OT_GAMEOBJ:
                        CurrentObject.XPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.GameObjectX);
                        CurrentObject.YPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.GameObjectY);
                        CurrentObject.ZPos = WowReader.ReadFloat(CurrentObject.BaseAddress + Pointers.WowObject.GameObjectZ);
                        CurrentObject.UnitFieldsAddress = WowReader.ReadUInt(CurrentObject.BaseAddress + Pointers.WowObject.DataPTR);
                        CurrentObject.Name = ItemNameFromBaseAddr(CurrentObject.BaseAddress);
                        CurrentObject.GameObjectType = ItemTypeFromBaseAddr(CurrentObject.BaseAddress);
                        break;
                }
            
            // set the current object as the next object in the object manager
            var tmpObject = CurrentObject;
            CurrentObject = new WowObject();
            list.push(tmpObject);
            CurrentObject.BaseAddress = WowReader.ReadUInt(tmpObject.BaseAddress + Pointers.ObjectManager.NextObject);
        }
        return list;
    }

}


function GetCurObj(){
    var proc  = getScanWow()
    proc.open()
    var ob = proc.readUint(0xb414c0)//0xB41414  + 0xAC 
    proc.close()
    return ob
}
function getPointer(){
    var proc  = getScanWow()
    proc.open()
    var rotacao = proc.readMemory(0x14BC0008+0x6b,4)
        proc.close()
    return rotacao
}

var a = new GameReader()
a.init()
//console.log(GetLocalGuid().toString(16))
//memBuffer = teste1.dwordBuffer(2863311531,2863311530+1);
//for(i=0;i<32;i++)console.log(memBuffer[i])

