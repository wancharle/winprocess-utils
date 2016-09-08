#include <windows.h>
#include <string>
#include <iostream>
#include "scan.h"
#include <node.h>
#include <node_buffer.h>
#include <v8.h>


using namespace v8;
using namespace node;

void myFree (char * bu, void *hint) {
	
}


void *ScanChar(DWORD start, DWORD end, HANDLE hProcess, char * marcador,size_t  tamanho,int pulo){ 
    char *buffer = new char[end-start];
	ReadProcessMemory(hProcess, (void *)start, buffer, end - start, NULL);
    for(unsigned i = 0; i < (end-start); ++i) 
    { 
		unsigned j =0;
		for( ;j < tamanho;){
			if (buffer[i+(j*pulo)] != marcador[j]) break;
			j=j+1;
		}
        if(j==(int)tamanho) 
        {                                      
            return (void*)(start+i);        
        } 
    } 
    delete[] buffer; 
    return 0; 
} 

void *ScanNumberDouble(DWORD start, DWORD end, HANDLE hProcess, double valor_marcador){  
    char *buffer = new char[end-start];
	double valor ;
	
	ReadProcessMemory(hProcess, (void *)start, buffer, end - start, NULL);
    for(unsigned i = 0; i < (end-start);) 
    { 
		valor = *((double*)(buffer+i));
		
	    if(valor==valor_marcador) 
        {                            
            return (void*)(start+i);        
        } 
		 i=i+1;
		 
    } 
    delete[] buffer; 

    return 0; 
 
} 

void *ScanNumberDoubleList(DWORD start, DWORD end, HANDLE hProcess, double* marcador, int tamanho,int tamanhodouble){  
    char *buffer = new char[end-start];
	double valor ;
		
	ReadProcessMemory(hProcess, (void *)start, buffer, end - start, NULL);
    for(unsigned i = 0; i < (end-start);) 
    { 
		int acertos = 0;
		for(unsigned j=0;j<tamanho;){
			valor = *((double*)(buffer+i+j*tamanhodouble)); // 16 é tamanho gasto para armazenar um double em 64bits 
			if(valor== marcador[j]) {
				//std::cout<<valor<<"|"<< std::hex<<(start+i+j*tamanhodouble)<<"|\n";
				acertos+=1;
			}else{
				break;
			}
			j+=1;
		}
	    if(acertos==tamanho) 
        {                                      
            return (void*)(start+i);        
        } 
		 i=i+1;
    } 
    delete[] buffer; 
    return 0; 
 
} 


void SetDebugPrivileges(){
    void* tokenHandle;
    OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &tokenHandle);
    TOKEN_PRIVILEGES privilegeToken;
    LookupPrivilegeValue(0, SE_DEBUG_NAME, &privilegeToken.Privileges[0].Luid);
    privilegeToken.PrivilegeCount = 1;
    privilegeToken.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
    AdjustTokenPrivileges(tokenHandle, 0, &privilegeToken, sizeof(TOKEN_PRIVILEGES), 0, 0);
    CloseHandle(tokenHandle);
}


void getProcessIdByWindow(const v8::FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = args.GetIsolate();  
 	v8::String::Utf8Value param1(args[0]->ToString());
	std::string processName = std::string(*param1);
	HWND hWnd = FindWindow(0,processName.c_str());
	if (hWnd != 0) {
		DWORD pId;
		GetWindowThreadProcessId(hWnd, &pId);
		args.GetReturnValue().Set(Number::New(isolate, pId));
	}else{
		args.GetReturnValue().Set(Boolean::New(isolate, false));
	}
}


// -- WinProcess
Persistent<Function> WinProcess::constructor;

WinProcess::WinProcess(DWORD pid) : _pid(pid), _handle(INVALID_HANDLE_VALUE) {
}

WinProcess::~WinProcess() {
	delete _handle;
}

void WinProcess::Init(Local<Object> exports) {
Isolate* isolate = Isolate::GetCurrent();
 
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "Process"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);
 
  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "open", Open);
  NODE_SET_PROTOTYPE_METHOD(tpl, "readMemory", ReadMemory);
  NODE_SET_PROTOTYPE_METHOD(tpl, "writeMemory", WriteMemory);
  NODE_SET_PROTOTYPE_METHOD(tpl, "readDouble", ReadDouble); 
  NODE_SET_PROTOTYPE_METHOD(tpl, "writeDouble", WriteDouble); 
  NODE_SET_PROTOTYPE_METHOD(tpl, "terminate", Terminate);
  //NODE_SET_PROTOTYPE_METHOD(tpl, "getBaseAddress", getBaseAddress);
  NODE_SET_PROTOTYPE_METHOD(tpl, "close", Close);
  
  NODE_SET_PROTOTYPE_METHOD(tpl, "scanBuffer", ScanBuffer);  
  NODE_SET_PROTOTYPE_METHOD(tpl, "scanDouble", ScanDouble);  
  NODE_SET_PROTOTYPE_METHOD(tpl, "scanDoubleList", ScanDoubleList);  
  
  constructor.Reset(isolate, tpl->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "Process"),tpl->GetFunction());
  NODE_SET_METHOD(exports, "getProcessIdByWindow", getProcessIdByWindow);
 }
 
void WinProcess::New(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
	if (args.IsConstructCall()) {
	    // Invoked as constructor: `new Process(...)`
	    DWORD id = args[0]->IsUndefined() ? 0 : (DWORD)args[0]->NumberValue();
	    WinProcess* obj = new WinProcess(id);
	    obj->Wrap(args.This());
	    args.GetReturnValue().Set(args.This());
	  } else {
	    // Invoked as plain function `Process(...)`, turn into construct call.
	    const int argc = 1;
	    Local<Value> argv[argc] = { args[0] };
	    Local<Function> cons = Local<Function>::New(isolate, constructor);
	    args.GetReturnValue().Set(cons->NewInstance(argc, argv));
	  }
}

void WinProcess::Open(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
    SetDebugPrivileges();
    obj->_handle = OpenProcess(PROCESS_ALL_ACCESS, FALSE, obj->_pid); // FIXME: 0xFFFF ver get_process_handle
    args.GetReturnValue().Set(Number::New(isolate, (uint64_t)obj->_handle));
}

void WinProcess::Close(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate); 
    WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
    if (obj->_handle != INVALID_HANDLE_VALUE)
    {
        CloseHandle(obj->_handle);
    }
}

void WinProcess::Terminate(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
    args.GetReturnValue().Set(Boolean::New(isolate, TerminateProcess(obj->_handle, 1)));
}
 
void WinProcess::ReadDouble(const FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
  
  	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
  	double valor;
	SIZE_T bytesRead;
  	if(ReadProcessMemory(obj->_handle, (void *)args[0]->IntegerValue(), &valor, sizeof(double), &bytesRead)){
		//std::cout<<"li="<<valor<<" com "<< bytesRead <<"\n";
		args.GetReturnValue().Set(Number::New(isolate,valor)); 
	}else{
		args.GetReturnValue().Set(Number::New(isolate, GetLastError()));
	}	
}

void WinProcess::WriteDouble(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
	
	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
	double valor = args[1]->NumberValue();
	if(WriteProcessMemory(obj->_handle, (void*)args[0]->IntegerValue(), &valor, sizeof(double), NULL)){
		args.GetReturnValue().Set(Boolean::New(isolate, true));	
	}
	else{
		args.GetReturnValue().Set(Number::New(isolate, GetLastError()));
	}
}
 
void WinProcess::ReadMemory(const FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
  
  	if (args.Length() < 2)
    {
        isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }
  
  	if (!args[0]->IsNumber() || !args[1]->IsNumber())
    {
        isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "Wrong arguments")));
        return;
    }
  
  	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
	int length = (int)args[1]->IntegerValue();	
  	char *buffer = new char[length];
  	SIZE_T bytesRead;
	if (ReadProcessMemory(obj->_handle, (void *)args[0]->IntegerValue(), buffer, length, &bytesRead))
    {
        args.GetReturnValue().Set(Buffer::New(isolate, buffer, (size_t)length, myFree, NULL).ToLocalChecked());
    }
    else
    {
        args.GetReturnValue().Set(Number::New(isolate, GetLastError()));
    }
}

void WinProcess::WriteMemory(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
	
	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
	size_t packetLen = Buffer::Length(args[1]);
	char* packet = Buffer::Data(args[1]);	
	
	if(WriteProcessMemory(obj->_handle, (void*)args[0]->IntegerValue(), packet, packetLen, NULL)){
		args.GetReturnValue().Set(Boolean::New(isolate, true));	
	}
	else{
		args.GetReturnValue().Set(Number::New(isolate, GetLastError()));
	}
}



void WinProcess::ScanBuffer(const FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
	
	// param 1: buffer 
	Local<Object> bufferObj    = args[0]->ToObject();
	char*         bufferData   = Buffer::Data(bufferObj);
	size_t        bufferLength = Buffer::Length(bufferObj);
	// param 2: pulo -> pulo=1 "HELLO" pulo=2 "H E L L O", pulo=3 "H  E  L  L  O" ...
	int pulo  = args[1]->IntegerValue();
	if (pulo <=0) pulo =1;


  	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());
	

    MEMORY_BASIC_INFORMATION mbi; 
    unsigned int start, end; 
    void * fromAddress = 0;
	void * lastFrom = 0;
    void * address = 0;
    SYSTEM_INFO si;        GetSystemInfo(&si);
	int interacao = 0;
    do 
    { 
        VirtualQueryEx(obj->_handle,(void*) fromAddress, &mbi, sizeof(MEMORY_BASIC_INFORMATION)); 
        if((mbi.State == MEM_COMMIT) && (mbi.Protect == PAGE_READWRITE) && (mbi.Type == MEM_PRIVATE)) 
        { 
			interacao++;
            start = (unsigned)mbi.BaseAddress; 
            end = (unsigned)mbi.BaseAddress+mbi.RegionSize; 
			//std::cout<<"start region:"<< std::hex << start <<" end "<< std::hex<< end << "\n";	
            address=ScanChar(start, end, obj->_handle,bufferData,bufferLength,pulo); 
	
            if (address> 0){
                   // std::cout<<"ENDERECO ENCONTRADO:"<< std::hex << address << "\n";
					break;
            }
 
 
        } 
		lastFrom = fromAddress;
        fromAddress = (void*)( (unsigned long)fromAddress + mbi.RegionSize); 
		if (fromAddress<lastFrom) break;
    } while(fromAddress < si.lpMaximumApplicationAddress && obj->_pid); 
	std::cout<<"Realizado "<< std::dec<<interacao <<" buscas. Valor endereco: "<<std::hex<<address<<"\n\n";
	args.GetReturnValue().Set(Number::New(isolate,(int)address));
}  
 
void WinProcess::ScanDouble(const FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
	
	double  valor_marcador = args[0]->Uint32Value();
  	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());


    MEMORY_BASIC_INFORMATION mbi; 
    unsigned int start, end; 
    void * fromAddress = 0;
	void * lastFrom = 0;
    void * address = 0;
    SYSTEM_INFO si;     
	GetSystemInfo(&si);
	int interacao = 0;
    do 
    { 
        VirtualQueryEx(obj->_handle,(void*) fromAddress, &mbi, sizeof(MEMORY_BASIC_INFORMATION)); 
        if((mbi.State == MEM_COMMIT) && (mbi.Protect == PAGE_READWRITE) && (mbi.Type == MEM_PRIVATE)) 
        { 
			interacao++;
            start = (unsigned)mbi.BaseAddress; 
            end = (unsigned)mbi.BaseAddress+mbi.RegionSize; 
			//std::cout<<"start region:"<< std::hex << start <<" end "<< std::hex<< end << "\n";	
            address=ScanNumberDouble(start, end, obj->_handle,valor_marcador); 
	
            if (address> 0){
					break;
            }
        } 
		lastFrom = fromAddress;
        fromAddress = (void*)( (unsigned long)fromAddress + mbi.RegionSize); 
		if (fromAddress<lastFrom) break;
    } while(fromAddress < si.lpMaximumApplicationAddress && obj->_pid); 
	std::cout<<"Realizado "<< std::dec<<interacao<<" buscas. Valor endereco: "<<std::hex<<address<<"\n\n";

	args.GetReturnValue().Set(Number::New(isolate,(int)address));
}  

void WinProcess::ScanDoubleList(const FunctionCallbackInfo<Value>& args) {
 	Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
	int tamanho = args.Length()-1;
		
	double *bufferData = new double[tamanho];
	int tamanhodouble = args[0]->IntegerValue();
	
	for (unsigned i=0; i< tamanho;i++){
			bufferData[i] = args[i+1]->NumberValue();			
	}

  	WinProcess* obj = ObjectWrap::Unwrap<WinProcess>(args.Holder());

    MEMORY_BASIC_INFORMATION mbi; 
    unsigned int start, end; 
    void * fromAddress = 0;
	void * lastFrom = 0;
    void * address = 0;
    SYSTEM_INFO si;     
	GetSystemInfo(&si);
	int interacao=0;
    do 
    { 
        VirtualQueryEx(obj->_handle,(void*) fromAddress, &mbi, sizeof(MEMORY_BASIC_INFORMATION)); 
        if((mbi.State == MEM_COMMIT) && (mbi.Protect == PAGE_READWRITE) && (mbi.Type == MEM_PRIVATE)) 
        { 	interacao++;
            start = (unsigned)mbi.BaseAddress; 
            end = (unsigned)mbi.BaseAddress+mbi.RegionSize; 
			//std::cout<<"start region:"<< std::hex << start <<" end "<< std::hex<< end << "\n";	
            address=ScanNumberDoubleList(start, end, obj->_handle,bufferData,tamanho,tamanhodouble); 	
            if (address> 0){
                   // std::cout<<"ENDERECO ENCONTRADO:"<< std::hex << address << "\n";
					break;
            }
        } 
		lastFrom = fromAddress;
        fromAddress = (void*)( (unsigned long)fromAddress + mbi.RegionSize); 
		if (fromAddress<lastFrom) break;
    } while(fromAddress < si.lpMaximumApplicationAddress && obj->_pid); 
	std::cout<<"Realizado "<<std::dec<< interacao <<" buscas. Valor endereco: "<<std::hex<<address<<"\n\n";
	args.GetReturnValue().Set(Number::New(isolate,(int)address));
}  


NODE_MODULE(scan, WinProcess::Init);

//NODE_MODULE(scan, init);

