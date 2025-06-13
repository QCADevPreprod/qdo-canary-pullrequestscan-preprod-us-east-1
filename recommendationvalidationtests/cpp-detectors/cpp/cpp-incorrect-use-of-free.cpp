#include <iostream>
#include <memory>

#define MAX_SIZE 256

struct record_t {
    // Define your struct members here
    int member1;
    char member2;
    // Add other members as needed
};

#define STATUS_INVALID 0
#define STATUS_UNKNOWN 1
#define STATUS_BLOCKED 2
#define STATUS_OK 3
#define MIN_UNIX_UID 1000

int hisuid;
int haveuid;

// Define authenticate function
int authenticate(char* login, char* passwd, int* i, char** message) {
    // Implementation of the authenticate function
    return 0;  // Placeholder return value
}

// Define getpwnam function
struct passwd {
    // Define struct members here
};

struct passwd* getpwnam(const char* login) {
    // Implementation of the getpwnam function
    return nullptr;  // Placeholder return value
}

void noncompliant1() {
    record_t bar[MAX_SIZE];
    /* do something interesting with bar */
    // Non-Compliant: Attempting to free memory not allocated with malloc/new
    // ruleid: cpp-incorrect-use-of-free
    free(bar);
}


class MyClass {
public:
    int value;
};

 void noncompliant2() {
     MyClass* obj = new MyClass();
	 // Non-Compliant: Accessing a freed object
     // ruleid: cpp-incorrect-use-of-free
     free(obj);
     std::cout << obj->value << std::endl;  // Unsafe:
 }


void noncompliant3() {
    int* arr = new int[5];
    // Non-Compliant: Accessing a freed dynamic array
    free(arr);
    // ruleid: cpp-incorrect-use-of-free
    std::cout << arr[0] << std::endl;
}


void noncompliant5() {
    int* arr = new int[5];
    int* ptr = arr + 3;
	// Non-Compliant: Using a pointer after its memory block has been freed
    free(ptr);
    // ruleid: cpp-incorrect-use-of-free
    std::cout << *ptr << std::endl;
}

void noncompliant6() {
    int localVar = 42;
    int* ptr = &localVar;
    // Non-Compliant: Attempting to free memory not allocated on the heap
    // ruleid: cpp-incorrect-use-of-free
    free(ptr);
}

int noncompliant7() {
    char *var = new char[5];
    // ruleid: cpp-incorrect-use-of-free
    free(var);
    // ruleid: cpp-incorrect-use-of-free
    free(var);
    return 0;
}

int noncompliant8(char* login, char* passwd) {
    char* cpass;
    char* message;
    int i = 0;
    int stat = STATUS_INVALID;
    struct passwd* pwd;

    if ((getpwnam(login)) == nullptr)
        return STATUS_UNKNOWN;
    haveuid = 1;

    if (hisuid < MIN_UNIX_UID)
        return STATUS_BLOCKED;

    if (authenticate(login, passwd, &i, &message) == 0) {
        stat = STATUS_OK;
        // ruleid: cpp-incorrect-use-of-free
        free(&message);
    }

    return stat;
}

void noncompliant9() {
    MyClass* obj = new MyClass();
	// Non-Compliant: Accessing a deleted object.
    // ruleid: cpp-incorrect-use-of-free
    delete obj;
    std::cout << obj->value << std::endl;
}

void noncompliant10() {
    int* arr = new int[5];
	// Non-Compliant: Accessing a dynamic array after deletion.
    // ruleid: cpp-incorrect-use-of-free
    delete arr;
    std::cout << arr[0] << std::endl;
}

void noncompliant11() {
    int* ptr = new int(42);
    // ruleid: cpp-incorrect-use-of-free
    delete ptr;
    // Non-Compliant: Double freeing the same memory.
    // ruleid: cpp-incorrect-use-of-free
    delete ptr;
}

void noncompliant13() {
    int localVar = 42;
    int* ptr = &localVar;
    int localVar2 = 42;
    // ok: cpp-incorrect-use-of-free
    delete ptr;
}


void compliant1() {
    int* ptr = new int(42);
    free(ptr);
    // Compliant: Nullifying the pointer after deallocation.
    // ok: cpp-incorrect-use-of-free
    ptr = nullptr;
}

void compliant2() {
    std::shared_ptr<int> ptr = std::make_shared<int>(42);
    // Compliant: Smart pointers automatically handle memory management.
    // ok: cpp-incorrect-use-of-free
    std::cout << *ptr << std::endl;
}


void compliant3() {
    int* ptr = new int(42);
    // Compliant: Pointer used within the local scope and deleted before exiting the scope.
    // ok: cpp-incorrect-use-of-free
    std::cout << *ptr << std::endl;
    free(ptr);
}

void compliant4() {
    int* ptr = new int(42);
    free(ptr);
    ptr = nullptr;
    // Compliant: Checking for null before using the pointer.
    // ok: cpp-incorrect-use-of-free
    if (ptr != nullptr) {
        std::cout << *ptr << std::endl;
    }
}

void compliant5() {
    int* dynamicVar = new int(42);
    // Compliant: Freeing memory allocated on the heap.
    // ok: cpp-incorrect-use-of-free
    free(dynamicVar);
}


void compliant6()
{
	record_t *bar = (record_t*)malloc(MAX_SIZE*sizeof(record_t));

	/* do something interesting with bar */
    // ok: cpp-incorrect-use-of-free
	free(bar);
}

void compliant7() {
    int* ptr = new int(42);
    delete ptr;
    // Compliant: Nullifying the pointer after deletion.
    // ok: cpp-incorrect-use-of-free
    ptr = nullptr;
}

void compliant8() {
    std::shared_ptr<int> ptr = std::make_shared<int>(42);
    // Compliant: Smart pointers automatically handle memory management.
    // ok: cpp-incorrect-use-of-free
    std::cout << *ptr << std::endl;
}

void compliant9() {
    int* ptr = new int(42);
    // Compliant: Pointer used within the local scope and deleted before exiting the scope.
    // ok: cpp-incorrect-use-of-free
    std::cout << *ptr << std::endl;
    delete ptr;
}

void compliant10() {
    int* ptr = new int(42);
    delete ptr;
    ptr = nullptr;
    // Compliant: Checking for null before using the pointer.
    // ok: cpp-incorrect-use-of-free
    if (ptr != nullptr) {
        std::cout << *ptr << std::endl;
    }
}


void compliant11() {
    int* dynamicVar = new int(42);
    // Compliant: Freeing memory allocated on the heap.
    // ok: cpp-incorrect-use-of-free
    delete dynamicVar;
}

void compliant12() {
     MyClass* obj = new MyClass();
	 std::cout << obj->value << std::endl;
	 // Compliant: Freeing memory allocated on the heap.
     // ok: cpp-incorrect-use-of-free
     free(obj);

 }

 void compliant13() {
    int* ptr = new int(42);
	int* ptr2 = new int(45);
    std::cout << *ptr << std::endl;
    free(ptr);
	// ok: cpp-incorrect-use-of-free
	ptr = ptr2;
}

void compliant15() {
    int* dynamicVar = new int(42);
    // ok: cpp-incorrect-use-of-free
    delete dynamicVar;
    *dynamicVar = 20;
}

Ptr<DFT1D> DFT1D::compliant16(int len, int count, int depth, int flags, bool *needBuffer)
{
    {
        ReplacementDFT1D *impl = new ReplacementDFT1D();
        if (impl->init(len, count, depth, flags, needBuffer))
        {
            return Ptr<DFT1D>(impl);
        }
        // ok: cpp-incorrect-use-of-free
        delete impl;
    }
    {
        OcvDftBasicImpl *impl = new OcvDftBasicImpl();
        impl->init(len, count, depth, flags, needBuffer);
        return Ptr<DFT1D>(impl);
    }
}
int main() {
    printf("Hello, World!");
    return 0;
}

AsyncIoUringSocket::~AsyncIoUringSocket() {
  DVLOG(3) << "~AsyncIoUringSocket() " << this;

  // this is a bit unnecesary if we are already closed, but proper state
  // tracking is coming later and will be easier to handle then
  closeNow();

  // evb_/backend_ might be null here, but then none of these will be in flight

  // cancel outstanding
  if (readSqe_->inFlight()) {
    DVLOG(3) << "cancel reading " << readSqe_.get();
    readSqe_->setReadCallback(
        nullptr, false); // not detaching, actually closing
    readSqe_->detachEventBase();
    backend_->cancel(readSqe_.release());
  }

  if (closeSqe_ && closeSqe_->inFlight()) {
    LOG_EVERY_N(WARNING, 100) << " closeSqe_ still in flight";
    closeSqe_
        ->markCancelled(); // still need to actually close it and it has no data
    closeSqe_.release();
  }
  if (connectSqe_ && connectSqe_->inFlight()) {
    DVLOG(3) << "cancel connect " << connectSqe_.get();
    connectSqe_->cancelTimeout();
    backend_->cancel(connectSqe_.release());
  }

  DVLOG(2) << "~AsyncIoUringSocket() " << this << " have active "
           << writeSqeActive_ << " queue=" << writeSqeQueue_.size();

  if (writeSqeActive_) {
    // if we are detaching, then the write will not have been submitted yet
    if (writeSqeActive_->inFlight()) {
      backend_->cancel(writeSqeActive_);
    } else {
      delete writeSqeActive_;
    }
  }

  while (!writeSqeQueue_.empty()) {
    WriteSqe* w = &writeSqeQueue_.front();
    CHECK(!w->inFlight());
    writeSqeQueue_.pop_front();
    // ok: cpp-incorrect-use-of-free
    delete w;
  }
}

void TimeoutManager::clearCobTimeouts() {
  if (!cobTimeouts_) {
    return;
  }

  // Delete any unfired callback objects, so that we don't leak memory
  // Note that we don't fire them.
  while (!cobTimeouts_->list.empty()) {
    auto* timeout = &cobTimeouts_->list.front();
    // ok: cpp-incorrect-use-of-free
    delete timeout;
  }
}

int PluginsManager::loadPluginFromPath(const TCHAR *pluginFilePath)
{
	const TCHAR *pluginFileName = ::PathFindFileName(pluginFilePath);
	if (isInLoadedDlls(pluginFileName))
		return 0;

	NppParameters& nppParams = NppParameters::getInstance();

	PluginInfo *pi = new PluginInfo;
	try
	{
		pi->_moduleName = pluginFileName;
		int archType = nppParams.archType();
		if (getBinaryArchitectureType(pluginFilePath) != archType)
		{
			const TCHAR* archErrMsg = TEXT("Cannot load plugin.");
			switch (archType)
			{
				case IMAGE_FILE_MACHINE_ARM64:
					archErrMsg = TEXT("Cannot load ARM64 plugin.");
					break;
				case IMAGE_FILE_MACHINE_I386:
					archErrMsg = TEXT("Cannot load 32-bit plugin.");
					break;
				case IMAGE_FILE_MACHINE_AMD64:
					archErrMsg = TEXT("Cannot load 64-bit plugin.");
					break;
			}

			throw generic_string(archErrMsg);
		}

        const DWORD dwFlags = GetProcAddress(GetModuleHandle(TEXT("kernel32.dll")), "AddDllDirectory") != NULL ? LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR | LOAD_LIBRARY_SEARCH_DEFAULT_DIRS : 0;
        pi->_hLib = ::LoadLibraryEx(pluginFilePath, NULL, dwFlags);
        if (!pi->_hLib)
        {
			generic_string lastErrorMsg = GetLastErrorAsString();
            if (lastErrorMsg.empty())
                throw generic_string(TEXT("Load Library has failed.\nChanging the project's \"Runtime Library\" setting to \"Multi-threaded(/MT)\" might solve this problem."));
            else
                throw generic_string(lastErrorMsg.c_str());
        }

		pi->_pFuncIsUnicode = (PFUNCISUNICODE)GetProcAddress(pi->_hLib, "isUnicode");
		if (!pi->_pFuncIsUnicode || !pi->_pFuncIsUnicode())
			throw generic_string(TEXT("This ANSI plugin is not compatible with your Unicode Notepad++."));

		pi->_pFuncSetInfo = (PFUNCSETINFO)GetProcAddress(pi->_hLib, "setInfo");

		if (!pi->_pFuncSetInfo)
			throw generic_string(TEXT("Missing \"setInfo\" function"));

		pi->_pFuncGetName = (PFUNCGETNAME)GetProcAddress(pi->_hLib, "getName");
		if (!pi->_pFuncGetName)
			throw generic_string(TEXT("Missing \"getName\" function"));
		pi->_funcName = pi->_pFuncGetName();

		pi->_pBeNotified = (PBENOTIFIED)GetProcAddress(pi->_hLib, "beNotified");
		if (!pi->_pBeNotified)
			throw generic_string(TEXT("Missing \"beNotified\" function"));

		pi->_pMessageProc = (PMESSAGEPROC)GetProcAddress(pi->_hLib, "messageProc");
		if (!pi->_pMessageProc)
			throw generic_string(TEXT("Missing \"messageProc\" function"));

		pi->_pFuncSetInfo(_nppData);

		pi->_pFuncGetFuncsArray = (PFUNCGETFUNCSARRAY)GetProcAddress(pi->_hLib, "getFuncsArray");
		if (!pi->_pFuncGetFuncsArray)
			throw generic_string(TEXT("Missing \"getFuncsArray\" function"));

		pi->_funcItems = pi->_pFuncGetFuncsArray(&pi->_nbFuncItem);

		if ((!pi->_funcItems) || (pi->_nbFuncItem <= 0))
			throw generic_string(TEXT("Missing \"FuncItems\" array, or the nb of Function Item is not set correctly"));

		pi->_pluginMenu = ::CreateMenu();

		Lexilla::GetLexerCountFn GetLexerCount = (Lexilla::GetLexerCountFn)::GetProcAddress(pi->_hLib, LEXILLA_GETLEXERCOUNT);
		// it's a lexer plugin
		if (GetLexerCount)
		{
			Lexilla::GetLexerNameFn GetLexerName = (Lexilla::GetLexerNameFn)::GetProcAddress(pi->_hLib, LEXILLA_GETLEXERNAME);
			if (!GetLexerName)
				throw generic_string(TEXT("Loading GetLexerName function failed."));

			//Lexilla::GetLexerFactoryFn GetLexerFactory = (Lexilla::GetLexerFactoryFn)::GetProcAddress(pi->_hLib, LEXILLA_GETLEXERFACTORY);
			//if (!GetLexerFactory)
				//throw generic_string(TEXT("Loading GetLexerFactory function failed."));

			Lexilla::CreateLexerFn CreateLexer = (Lexilla::CreateLexerFn)::GetProcAddress(pi->_hLib, LEXILLA_CREATELEXER);
			if (!CreateLexer)
				throw generic_string(TEXT("Loading CreateLexer function failed."));

			//Lexilla::GetLibraryPropertyNamesFn GetLibraryPropertyNames = (Lexilla::GetLibraryPropertyNamesFn)::GetProcAddress(pi->_hLib, LEXILLA_GETLIBRARYPROPERTYNAMES);
			//if (!GetLibraryPropertyNames)
				//throw generic_string(TEXT("Loading GetLibraryPropertyNames function failed."));

			//Lexilla::SetLibraryPropertyFn SetLibraryProperty = (Lexilla::SetLibraryPropertyFn)::GetProcAddress(pi->_hLib, LEXILLA_SETLIBRARYPROPERTY);
			//if (!SetLibraryProperty)
				//throw generic_string(TEXT("Loading SetLibraryProperty function failed."));

			//Lexilla::GetNameSpaceFn GetNameSpace = (Lexilla::GetNameSpaceFn)::GetProcAddress(pi->_hLib, LEXILLA_GETNAMESPACE);
			//if (!GetNameSpace)
				//throw generic_string(TEXT("Loading GetNameSpace function failed."));

			// Assign a buffer for the lexer name.
			char lexName[MAX_EXTERNAL_LEXER_NAME_LEN];
			lexName[0] = '\0';

			int numLexers = GetLexerCount();

			ExternalLangContainer* containers[30];

			for (int x = 0; x < numLexers; ++x)
			{
				GetLexerName(x, lexName, MAX_EXTERNAL_LEXER_NAME_LEN);
				if (!nppParams.isExistingExternalLangName(lexName) && nppParams.ExternalLangHasRoom())
				{
					containers[x] = new ExternalLangContainer;
					containers[x]->_name = lexName;
					containers[x]->fnCL = CreateLexer;
					//containers[x]->fnGLPN = GetLibraryPropertyNames;
					//containers[x]->fnSLP = SetLibraryProperty;
				}
				else
				{
					containers[x] = NULL;
				}
			}

			TCHAR xmlPath[MAX_PATH];
			wcscpy_s(xmlPath, nppParams.getNppPath().c_str());
			PathAppend(xmlPath, TEXT("plugins\\Config"));
            PathAppend(xmlPath, pi->_moduleName.c_str());
			PathRemoveExtension(xmlPath);
			PathAddExtension(xmlPath, TEXT(".xml"));

			if (!PathFileExists(xmlPath))
			{
				lstrcpyn(xmlPath, TEXT("\0"), MAX_PATH );
				wcscpy_s(xmlPath, nppParams.getAppDataNppDir() );
				PathAppend(xmlPath, TEXT("plugins\\Config"));
                PathAppend(xmlPath, pi->_moduleName.c_str());
				PathRemoveExtension( xmlPath );
				PathAddExtension( xmlPath, TEXT(".xml") );

				if (! PathFileExists( xmlPath ) )
				{
					throw generic_string(generic_string(xmlPath) + TEXT(" is missing."));
				}
			}

			TiXmlDocument *pXmlDoc = new TiXmlDocument(xmlPath);

			if (!pXmlDoc->LoadFile())
			{
				delete pXmlDoc;
				pXmlDoc = NULL;
				throw generic_string(generic_string(xmlPath) + TEXT(" failed to load."));
			}

			for (int x = 0; x < numLexers; ++x) // postpone adding in case the xml is missing/corrupt
			{
				if (containers[x] != NULL)
					nppParams.addExternalLangToEnd(containers[x]);
			}

			nppParams.getExternalLexerFromXmlTree(pXmlDoc);
			nppParams.getExternalLexerDoc()->push_back(pXmlDoc);


			//const char *pDllName = wmc.wchar2char(pluginFilePath, CP_ACP);
			//::SendMessage(_nppData._scintillaMainHandle, SCI_LOADLEXERLIBRARY, 0, reinterpret_cast<LPARAM>(pDllName));


		}
		addInLoadedDlls(pluginFilePath, pluginFileName);
		_pluginInfos.push_back(pi);
		return static_cast<int32_t>(_pluginInfos.size() - 1);
	}
	catch (std::exception& e)
	{
		pluginExceptionAlert(pluginFileName, e);
		return -1;
	}
	catch (generic_string& s)
	{
		if (pi && pi->_hLib)
		{
			::FreeLibrary(pi->_hLib);
		}

		s += TEXT("\n\n");
		s += pluginFileName;
		s += USERMSG;
		if (::MessageBox(_nppData._nppHandle, s.c_str(), pluginFilePath, MB_YESNO) == IDYES)
		{

			::DeleteFile(pluginFilePath);
		}
    // ok: cpp-incorrect-use-of-free
		delete pi;
		return -1;
  }
  catch (...)
	{
		if (pi && pi->_hLib)
		{
			::FreeLibrary(pi->_hLib);
		}

		generic_string msg = TEXT("Failed to load");
		msg += TEXT("\n\n");
		msg += pluginFileName;
		msg += USERMSG;
		if (::MessageBox(_nppData._nppHandle, msg.c_str(), pluginFilePath, MB_YESNO) == IDYES)
		{
			::DeleteFile(pluginFilePath);
		}
    // ok: cpp-incorrect-use-of-free
		delete pi;
		return -1;
	}
}

void compliant14() {
    char *var = malloc(sizeof(char) * 10);
    if(var != NULL) {
       goto end;
    }

    delete var;

    end:
      // ok: cpp-incorrect-use-of-free
      delete var;
}

// {fact rule=redundant-free-usage@v1.0 defects=1}
	void alloc_and_free1()
	{
		int bailout = 1;
		char *ptr = (char *)malloc(MEMSIZE);

		// this should be catched but it isn't, due to a documented limitation in semgrep
		// https://semgrep.dev/docs/writing-rules/pattern-syntax/#ellipses-and-statement-blocks
		if (bailout)
			free(ptr);
    // ruleid: cpp-incorrect-use-of-free
		free(ptr);
		// ruleid: cpp-incorrect-use-of-free
		free(ptr);
	}
	// {/fact}

	// {fact rule=redundant-free-usage@v1.0 defects=0}
	void alloc_and_free2()
	{
		char *ptr = (char *)malloc(MEMSIZE);

		free(ptr);
		ptr = NULL;
		// ok: cpp-incorrect-use-of-free
		free(ptr);
	}
	// {/fact}

	// {fact rule=redundant-free-usage@v1.0 defects=0}
	void alloc_and_free3()
	{
		char *ptr = (char *)malloc(MEMSIZE);

		free(ptr);
		ptr = (char *)malloc(MEMSIZE);
		// ok: cpp-incorrect-use-of-free
		free(ptr);
	}
	// {/fact}

	// {fact rule=redundant-free-usage@v1.0 defects=1}
	void double_free(int argc, char **argv)
	{
		char *buf1R1;
		char *buf2R1;
		char *buf1R2;
		buf1R1 = (char *) malloc(BUFSIZE2);
		buf2R1 = (char *) malloc(BUFSIZE2);
		free(buf1R1);
    // ruleid: cpp-incorrect-use-of-free
		free(buf2R1);
		buf1R2 = (char *) malloc(BUFSIZE1);
		strncpy(buf1R2, argv[1], BUFSIZE1-1);
		// ruleid: cpp-incorrect-use-of-free
		free(buf2R1);
		free(buf1R2);
	}
	// {/fact}

	int getNextPacket()
	{
		// do something
		return 0;
	}

	void logPktData(int pkt){
		// do something
	}

	void processPacket(int pkt){
		// do something
	}

	// {fact rule=redundant-free-usage@v1.0 defects=1}
	int bad(int *logData)
	{
    // ruleid: cpp-incorrect-use-of-free
		free(logData);
		int pkt = getNextPacket();
		if(!pkt) {
				return 0;
		}
		logPktData(pkt);
		// ruleid: cpp-incorrect-use-of-free
		free(logData);
		processPacket(pkt);
	}
	// {/fact}

// {fact rule=use-after-free@v1.0 defects=1}
	void alloc_and_free1()
	{
		int err = 1, bailout = 0;
		char *ptr = (char *)malloc(MEMSIZE);

		// this should be catched but it isn't, due to a documented limitation in semgrep
		// https://semgrep.dev/docs/writing-rules/pattern-syntax/#ellipses-and-statement-blocks
		if (err) {
			bailout = 1;
			free(ptr);
		}
		if (bailout)
			fprintf(stderr, "error: %p\n", ptr);

		free(ptr);
		// ruleid: cpp-incorrect-use-of-free
		fprintf(stderr, "error: %p\n", ptr);
	}
	// {/fact}

	// {fact rule=use-after-free@v1.0 defects=0}
	void alloc_and_free2()
	{
		char *ptr = (char *)malloc(MEMSIZE);

		free(ptr);
		ptr = (char *)malloc(MEMSIZE);
		// ok: cpp-incorrect-use-of-free
		fprintf(stderr, "error: %p\n", ptr);
	}
	// {/fact}

	// {fact rule=use-after-free@v1.0 defects=1}
	void uaf(int argc, char **argv)
	{
		char *buf1R1;
		char *buf2R1;
		char *buf2R2;
		char *buf3R2;
		buf1R1 = (char *) malloc(BUFSIZER1);
		buf2R1 = (char *) malloc(BUFSIZER1);
		free(buf2R1);
		buf2R2 = (char *) malloc(BUFSIZER2);
		buf3R2 = (char *) malloc(BUFSIZER2);
		// ruleid: cpp-incorrect-use-of-free
		strncpy(buf2R1, argv[1], BUFSIZER1-1);
		free(buf1R1);
		free(buf2R2);
		free(buf3R2);
	}
	// {/fact}

	// {fact rule=use-after-free@v1.0 defects=1}
	// https://docs.microsoft.com/en-us/cpp/sanitizers/error-heap-use-after-free
	int heap_use_after_free()
	{
		char *x = (char*)malloc(10 * sizeof(char));
		free(x);

		// ...

		// ruleid: cpp-incorrect-use-of-free
		return x[5];
	}
	// {/fact}

	// {fact rule=use-after-free@v1.0 defects=1}
	char test()
	{
		char *ptr = (char *)malloc(10 * sizeof(char));
		free(ptr);

		// ruleid: cpp-incorrect-use-of-free
		return *ptr;
	}
	// {/fact}

	class B {
		void bad3(bool);
		void good3();
	};

	void B::bad3(bool heap) {
		int localArray[2] = { 11,22 };
		int *p = localArray;

		if (heap) {
			p = new int[2];
		}
		// {fact rule=redundant-free-usage@v1.0 defects=1}
		// ruleid: cpp-incorrect-use-of-free
		delete[] p;
		// {/fact}
	}

	void B::good3() {
		int localArray[2] = { 11,22 };
		int *p = localArray;

		p = new (std::nothrow) int[2];
		// {fact rule=redundant-free-usage@v1.0 defects=0}
		// ok: cpp-incorrect-use-of-free
		delete[] p;
		// {/fact}
	}

	void B::good4(bool heap) {
		int localArray[2] = { 11,22 };
		int *p = localArray;
		p = new int[2];
		// ok: cpp-incorrect-use-of-free
		delete[] p;
	}