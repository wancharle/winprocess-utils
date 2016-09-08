#ifndef __scam__
#define __scam__

#define TAM_FRASE 4000

#include <windows.h>
 
#include <node.h>
#include <node_object_wrap.h>

HWND get_process_window(std::string);
HANDLE get_process_handle(HWND);

void get_string(char * texto);
double get_wow_status();
void* Search( HANDLE hProcess);
void escreve_string(  char * texto);
 void  SetDebugPrivileges();
int esta_logado();
int esta_rodando();


 
class WinProcess : public node::ObjectWrap {
 public:
  static void Init(v8::Handle<v8::Object> exports);
 
 private:
  explicit WinProcess(DWORD pid = 0);
  ~WinProcess();
 
  HANDLE _handle;
  DWORD _pid;
 
  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void Open(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void Close(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void Terminate(const v8::FunctionCallbackInfo<v8::Value>& args);
  
  static void ReadMemory(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void WriteMemory(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ReadDouble(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void WriteDouble(const v8::FunctionCallbackInfo<v8::Value>& args);


  static void ScanBuffer(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ScanDouble(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void ScanDoubleList(const v8::FunctionCallbackInfo<v8::Value>& args);


//  static void getBaseAddress(const v8::FunctionCallbackInfo<v8::Value>& args);


  static v8::Persistent<v8::Function> constructor;
  
};
 


#endif
