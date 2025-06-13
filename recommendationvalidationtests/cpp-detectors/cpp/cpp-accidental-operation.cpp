#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stddef.h>
#include <errno.h>
#include <cstdlib>
#include <cassert>
#include <iostream>

using namespace std;


void die(const char* a){
    //do something
}

// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_1() {
    char *src, *dst;
    int left;

    while (*src && left) {
        *dst++=*src++;
        // Used assignment instead of equality
        // ruleid: cpp-accidental-operation
        if (left = 0) {
                die("badlen");
        }
        left--;
    }
}
// {/fact}

// {fact rule=incorrect-operator@v1.0 defects=0}
void conformant_1(char *path, char *dir, char *obj) {
    char *last;

    // ok: cpp-accidental-operation
    if ( (last = strrchr(path,'/')) != NULL ) {
        strcpy(obj, last + 1);
        if (last == path) {
            strcpy(dir, "/");
        } else {
            *last = '\0';
            strcpy(dir, path);
            *last = '/';
        }
    } else {
        dir[0] = dir[0] = '\0';
    }
}
// {/fact}

// Helper function
const char* get_security_flags(const char* username){
    // do something
    return "OKAY";
}

int get_string(char* src){
    return 0;
}

int check_for_overflow(char* src){
    return 0;
}

int copy_string(char* dst, char* src){
    return 0;
}

// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_3(char *src, int len)
{
    char dst[256];
    // Terminated if statement
    // ruleid: cpp-accidental-operation
    if (len > 0 && len <= sizeof(dst));
        memcpy(dst, src, len);
}
// {/fact}

// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_fp_case1(char *src, int len)
{
    char dst[256];
    // Terminated if statement
    // ruleid: cpp-accidental-operation
    if (len > 0 & len <= sizeof(dst)){
        memcpy(dst, src, len);
    }
}
// {/fact}


// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_fp_case2(char *src, int len)
{
    char dst[256];
    // using bitwise operator(|) or, insted of logical or (||)
    // ruleid: cpp-accidental-operation
    if (len > 0 | len <= sizeof(dst)){
        memcpy(dst, src, len);
    }
}
// {/fact}


// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_4(char *src, char *dst)
{
    int i;
    // Comparison instead of assignment
    // ruleid: cpp-accidental-operation
    for (i == 5; src[i] && i < 10; i++) {
        dst[i - 5] = src[i];
    }
}
// {/fact}

void non_conformant_5(char *userinput)
{   // {fact rule=incorrect-operator@v1.0 defects=1}
    // Redundant 0 before literal
    // ruleid: cpp-accidental-operation
    char buf1[040];
    // {/fact}
    snprintf(buf1, 40, "%s", userinput);

    // {fact rule=incorrect-operator@v1.0 defects=1}
    // ok: cpp-accidental-operation
    char buf[0x40];
    // {/fact}

    snprintf(buf, 40, "%s", userinput);
}

struct YourStructType {
    // Define the members of the structure or object
    // For example:
    char* init_buf;
    int init_num;
};

// {fact rule=incorrect-operator@v1.0 defects=1}
void non_conformant_7(int j)
{
    int i = 10;

    // Use of =+ instad of +=
    // ruleid: cpp-accidental-operation
    i =+ j;
}
// {/fact}

// {fact rule=incorrect-operator@v1.0 defects=1}
int isValid(int value)
{
    // Assignment instead of comparison
    // ruleid: cpp-accidental-operation
    if (value = 100) {
        printf("Value is valid\n");
        return(1);
    }

    printf("Value is not valid\n");
    return(0);
}
// {/fact}

void processChar(char a){
    //do something
}

void movingToNewInput(){
    //do something
}

// {fact rule=incorrect-operator@v1.0 defects=1}
void processString (char *str)
{
    int i;

    for(i = 0; i < strlen(str); i++) {
        if (isalnum(str[i])){
            processChar(str[i]);

        // Assignment instead of comparison
        // ruleid: cpp-accidental-operation
        } else if (str[i] = ':') {
            movingToNewInput();
        }
    }
}
// {/fact}

// {fact rule=incorrect-operator@v1.0 defects=1}
#define SIZE 50
int *tos, *p1, stack[SIZE];

void push(int i)
{
    p1++;
    if (p1 == (tos + SIZE)) {
        printf("Print stack overflow error message and exit\n");
    }

    // Comparison instead of assignment
    // ruleid: cpp-accidental-operation
    *p1 == i;
}
// {/fact}

int pop(void)
{
    if (p1 == tos) {
        printf("Print stack underflow error message and exit\n");
    }
    p1--;
    return *(p1 + 1);
}

// Declare the function lr_error with proper parameters and return type
void lr_error(const char* cmfile, const char* format, const char* message){
    //
}

// Declare the structure or type of 'result' and 'nowtok'
struct ResultType {
    int mb_cur_max;
    // Add other members if needed
};

// Declare the variable 'cmfile' assuming it's a string
const char* cmfile;

// Declare the variables 'nowtok', 'tok_mb_cur_max', and 'tok_mb_cur_min'
int nowtok, tok_mb_cur_max, tok_mb_cur_min;

// Declare the variables 'result', 'cmfile', 'nowtok', 'tok_mb_cur_max', and 'tok_mb_cur_min'
struct ResultType *result;

// {fact rule=incorrect-operator@v1.0 defects=1}
void test1()
{
    // Same condition is checked twice
    // ruleid: cpp-accidental-operation
    if ((nowtok == tok_mb_cur_max && result->mb_cur_max != 0) || (nowtok == tok_mb_cur_max && result->mb_cur_max != 0))
        lr_error (cmfile, ("duplicate definition of <%s>"), nowtok == tok_mb_cur_min ? "mb_cur_min" : "mb_cur_max");
}
// {/fact}

int borg_extract_dir(int x1, int x2, int y1, int y2){
    return 0;
}

int borg_cave_floor_bold(int x, int y){
    return 1;
}

// {fact rule=incorrect-operator@v1.0 defects=1}
int test2(int x1, int x2, int y1, int y2)
{
    int e = borg_extract_dir(y1, x1, y2, x2);

    int ay = 5;
    int ax = 6;
    // Same condition checked twice
    // ruleid: cpp-accidental-operation
    if ((ay <= 1) && (ay <= 1))
        return (e);

    if (ay > ax) {
        int d = (y1 < y2) ? 2 : 8;
        int ddy[d];
        int ddx[d];
        if (borg_cave_floor_bold(y1 + ddy[d], x1 + ddx[d])) return (d);
    }
}
// {/fact}


struct fsa_node_addr {
    // Add members if needed
};

// Declaration of fsa_error function if not provided by a library
void fsa_error(int level, const char* format, ...){

}

// Declaration of do_something function if not provided by a library
void do_something(){
    //
}


// {fact rule=incorrect-operator@v1.0 defects=1}
void test5(char *szbuf1)
{
    // Accidental strcpy instead of strcmp
    // ruleid: cpp-accidental-operation
    if(strcpy(szbuf1, "Manager") == 0) {
        do_something();
    }
}
// {/fact}

struct StateType {
    // Define members if needed
    int* rx;
};

// {fact rule=incorrect-operator@v1.0 defects=0}
void test6()
{
    // Check if the rx chain should be empty

    StateType *state;
    // ok: cpp-accidental-operation
    if (!(state->rx == NULL))
    {
        // Print an error message if the condition is not met
        std::cerr << "Assertion failed: in this state, the rx chain should be empty" << std::endl;
        std::abort(); // Abort the program
    }
}
// {/fact}


//Added Cases Causing FPs

void Win32Window::UpdateTheme(HWND const window) {
  DWORD light_mode;
  DWORD light_mode_size = sizeof(light_mode);
  LSTATUS result = RegGetValue(HKEY_CURRENT_USER, kGetPreferredBrightnessRegKey,
                               kGetPreferredBrightnessRegValue,
                               RRF_RT_REG_DWORD, nullptr, &light_mode,
                               &light_mode_size);

  if (result == ERROR_SUCCESS) {
    BOOL enable_dark_mode = light_mode == 0;
    DwmSetWindowAttribute(window, DWMWA_USE_IMMERSIVE_DARK_MODE,
                          &enable_dark_mode, sizeof(enable_dark_mode));
  }
}

void someMethod()
{
    vector<uint8_t> input_pe_file_buffer(istreambuf_iterator<char>(input_pe_file_reader), {});

	//Parsing Input PE File
	PIMAGE_DOS_HEADER in_pe_dos_header = (PIMAGE_DOS_HEADER)input_pe_file_buffer.data();
	PIMAGE_NT_HEADERS in_pe_nt_header = (PIMAGE_NT_HEADERS)(input_pe_file_buffer.data() + in_pe_dos_header->e_lfanew);

	//Valideren PE Infromation
	bool isPE = in_pe_dos_header->e_magic == IMAGE_DOS_SIGNATURE;
	bool is64 = in_pe_nt_header->FileHeader.Machine == IMAGE_FILE_MACHINE_AMD64 &&
		in_pe_nt_header->OptionalHeader.Magic == IMAGE_NT_OPTIONAL_HDR64_MAGIC;
	bool isDLL = in_pe_nt_header->FileHeader.Characteristics & IMAGE_FILE_DLL;
	bool isNET = in_pe_nt_header->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR].Size != 0;
}

int main(int argc, char *argv[])
{
    tos = stack;
    p1 = stack;
    // ...
    return 0;
}

// FP Cases

bool R5FrameProcessor::param_request_handler(const uint8_t sensor_id, uint32_t message_id)
{
    bool success = false;

    if(is_initialized())
    {
        bool params_written = ((sensor_id == 0u) ? (sensor_0_params_written) : (sensor_1_params_written));
        if(params_written)
        {
            uint8_t byte_0 = ((*param_data_buffer_ptr)[sensor_id])[BYTE_0_OFFSET];
            uint8_t byte_1 = ((*param_data_buffer_ptr)[sensor_id])[BYTE_1_OFFSET];
            uint8_t byte_2 = ((*param_data_buffer_ptr)[sensor_id])[BYTE_2_OFFSET];
            uint8_t byte_3 = ((*param_data_buffer_ptr)[sensor_id])[BYTE_3_OFFSET];
            message_id = deserialize_uint32(byte_0, byte_1, byte_2, byte_3);
        }
        else
        {
            write_params_to_buffer(sensor_id, message_id);
        }

        std::lock_guard<std::mutex> guard(tx_buffer_mtx); /* parasoft-suppress AUTOSAR-M0_1_3-a AR-EXCPP-019 */
        tx_buffer.resize(0u);
        ByteWriter stream(tx_buffer, BytePackingStrategy::lsb_first);
        stream.write_uint16(R5_MSG_PREAMBLE);
        stream.write_uint32(R5_MSG_TYPE_PARAM_RESP);
        stream.write_uint8(sensor_id);
        stream.write_uint8(R5_ID_BROADCAST);
        stream.write_uint32(message_id);
        tx_buffer.resize(R5_MAX_TX_MSG_SIZE);
        send_msg();

        success = true;
    }
    else
    {
        log_txt(txt_log_level::ARL_ERR, "R5 PROCESSOR NOT YET INITIALIZED");
    }

    if(success)
    {
        log_txt(txt_log_level::ARL_TRACE, "SENDING PROC PARAM FOR SENSOR %d", sensor_id);
    }
    else
    {
        log_txt(txt_log_level::ARL_ERR, "COULD NOT SEND PROC PARAM FOR SENSOR %d", sensor_id);
    }

    return success;
}

void test_calculate_delta() {
    MockQueryResults query_results{5, 0};
    QueryResultContainer container = create_container(query_results, {"0", "3", "3", "3", "1"});

    graded_demote gd = graded_demote(params, {graded_demote_feature_name});
    CPPUNIT_ASSERT_EQUAL((size_t)0, gd.position_scaling_factor_.size());

    std::vector<std::size_t> deltas = gd.calculate_delta(container.begin(), container.end(), demote_score_rank_info);
    std::vector<std::size_t> expected = {0, 3, 3, 2, 1};
    CPPUNIT_ASSERT(expected == deltas);
}

bool QIALMCategoryClassifier::classifyQueryContext(query_context const& qc, ClassificationLabelsPtr& classification) {

  qiaDbMap lmScores;
  if (!getLMScoresFromQUContext(qc, lmScores)) {
    return false;
  }

  if (lmScores.empty()) {
    return false;
  }

  double sumScores = 0;

  qiaDbMap labelScores;

  BOOST_FOREACH (qiaDbMap::value_type const& aliasScore, lmScores) {
    string label = aliasScore.first;
    StringToStringMap::const_iterator aliasIt = aliasLabelMap_.find(aliasScore.first);
    if (aliasIt != aliasLabelMap_.end()) {
      label = aliasIt->second;
    } else {
      continue;
    }
    sumScores += aliasScore.second;

    qiaDbMap::iterator it = labelScores.find(label);
    if (it != labelScores.end()) {
      it->second += aliasScore.second;
    } else {
      labelScores[label] = aliasScore.second;
    }
  }

  if (sumScores <= 0 || labelScores.size() == 0) {
    return false;
  }

  classification = boost::make_shared<ClassificationLabels>();
  BOOST_FOREACH (qiaDbMap::value_type& labelScore, labelScores) {
    double score = labelScore.second / sumScores;

    if (score >= getThreshold(labelScore.first)) {
      classification->label_scores.push_back(std::pair<double, string>(score, labelScore.first));
    }
  }

  std::sort(classification->label_scores.rbegin(), classification->label_scores.rend());

  return true;
}

ScoreInjectorConfig Search::ExternalScorer::make_score_injector_config(Metadata::GenericElementPtr const& el) {
  ScoreInjectorConfig config;
  for (auto&& param : el->subElements_) {
    auto name_it = param->attributes_.find(s_name);
    if (name_it != param->attributes_.end()) {
      if (name_it->second == s_skip_partial_precompute) {
        config.skip_partial_precompute = boost::algorithm::to_lower_copy(param->value_) == "true";
      }
    }
  }
  return config;
}

BOOST_FOREACH (GenericElementPtr const& setting) {
    string const& name = setting->name_;
    if (name == METADATA_CONFIDENCE_THRESHOLD) {
      confidence_threshold_ = atof(setting->value_.c_str());
    } else if (name == METADATA_LABEL) {
      label_ = setting->value_;
      AttributeMap::iterator pos;
      pos = setting->attributes_.find(METADATA_LABEL_FORMAT);
      BI_label_format_ = (pos != setting->attributes_.end()) && (pos->second == string("BI"));

    }
}


int a = 0;
//value assinged to total_size and compared a Number
const int total_size = a;
//total_size is compared with 0
// ok: cpp-accidental-operation
if (total_size == 0) {
    return false;
  }

// {fact rule=incorrect-operator@v1.0 defects=1}
// ruleid: cpp-accidental-operation
if (auto strongController = m_readerController.lock()) {
    auto documentContext = m_documentContext.lock();
    if (!documentContext) {
        KNDK_LOG_ERROR(MODULE_NAME, "Unable to request all annotations because document context is not defined");
        return;
    }
  }
  // {/fact}
