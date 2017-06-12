/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Windows WSH Module
FileName:       stslib_win_wsh.js
----------------------------------------
License:        MIT License
All Right Reserved:
	Name:         Standard Software
	URL:          https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/05/28
//----------------------------------------*/

//----------------------------------------
//���W���@�\
//----------------------------------------

//----------------------------------------
//�E���b�Z�[�W�\��
//----------------------------------------
//	�E	WSH �ł� alert �������̂Ŋ֐����쐬����
//----------------------------------------
var alert = alert || function (message) {
	WScript.Echo(message);
};

//----------------------------------------
//���e�L�X�g �t�@�C�� ���o��
//----------------------------------------
var encodingTypeJpCharCode = {
	NONE                :0,
	ASCII				:1,
	JIS					:2,
	EUC_JP				:3,
	UTF_7				:4,
	Shift_JIS			:5,
	UTF8_BOM			:6,
	UTF8_BOM_NO			:7,
	UTF16_LE_BOM		:8,
	UTF16_LE_BOM_NO		:9,
	UTF16_BE_BOM		:10,
	UTF16_BE_BOM_NO		:11
}

function getEncodingTypeName(encodingType) {
	switch (encodingType) {
	case encodingTypeJpCharCode.Shift_JIS: 
		return "SHIFT_JIS";

	case encodingTypeJpCharCode.UTF16_LE_BOM:
		return "UNICODEFFFE";
	case encodingTypeJpCharCode.UTF16_LE_BOM_NO:
		return "UTF-16LE";
	
	case encodingTypeJpCharCode.UTF16_BE_BOM:
		return "UNICODEFEFF";
	case encodingTypeJpCharCode.UTF16_BE_BOM_NO:
		return "UTF-16BE";
	
	case encodingTypeJpCharCode.UTF8_BOM:
		return "UTF-8";
	case encodingTypeJpCharCode.UTF8_BOM_NO:
		return "UTF-8N";
	
	case encodingTypeJpCharCode.JIS:
		return "ISO-2022-JP";
		
	case encodingTypeJpCharCode.EUC_JP:
		return "EUC-JP";
	
	case encodingTypeJpCharCode.UTF_7:
		return "UTF-7";
	}
}

function string_LoadFromFile(filePath, encodingType) {
	var result = '';
	var encordingName = getEncodingTypeName(encodingType)

	var stream = new ActiveXObject('ADODB.Stream');
	stream.Type = 2;		//(adTypeText = 2)
	switch (encodingType) {
	case encodingTypeJpCharCode.UTF8_BOM_NO: 
		stream.Charset = getEncodingTypeName(EncodingTypeJpCharCode.UTF8_BOM);
		break;
	default: 
		stream.Charset = encordingName;
		break;
	}
	stream.Open();
	stream.LoadFromFile(filePath);
	result = stream.ReadText();
	stream.Close();
	return result;
}

//----------------------------------------
//���V�X�e��
//----------------------------------------
wshShell = new ActiveXObject( "WScript.Shell" );

//----------------------------------------
//�E�t�@�C���w�肵���V�F���N��
//----------------------------------------
//Const vbHide = 0             '�E�B���h�E��\��
//Const vbNormalFocus = 1      '�ʏ�\���N��
//Const vbMinimizedFocus = 2   '�ŏ����N��
//Const vbMaximizedFocus = 3   '�ő剻�N��
//Const vbNormalNoFocus = 4    '�ʏ�\���N���A�t�H�[�J�X�Ȃ�
//Const vbMinimizedNoFocus = 6 '�ŏ����N���A�t�H�[�J�X�Ȃ�

function shellFileOpen(FilePath, Focus) {

	wshShell.Run(
		"rundll32.exe url.dll" +
		",FileProtocolHandler " + FilePath
		, Focus, false)
	//�t�@�C���N���̏ꍇ
	//��O������Wait��true�ɂ��Ă����������l�q
}

//----------------------------------------
//�����b�Z�[�W�\��
//----------------------------------------

  //  �{�^���̎��
  var BTN_OK                 = 0;    // [�n�j]�{�^��
  var BTN_OK_CANCL           = 1;    // [�n�j][�L�����Z��]�{�^��
  var BTN_STOP_RETRI_DISRGRD = 2;    // [���~][�Ď��s][����]�{�^��
  var BTN_YES_NO_CANCL       = 3;    // [�͂�][������][�L�����Z��]�{�^��
  var BTN_YES_NO             = 4;    // [�͂�][������]�{�^��
  var BTN_RETRI_CANCL        = 5;    // [�Ď��s][�L�����Z��]�{�^��

  //  �A�C�R���̎��
  var ICON_STOP              = 16;   // [Stop]�A�C�R��
  var ICON_QUESTN            = 32;   // [?]�A�C�R��
  var ICON_EXCLA             = 48;   // [!]�A�C�R��
  var ICON_I                 = 64;   // [i]�A�C�R��

  //  �����ꂽ�{�^�����Ƃ̖߂�l
  var BTNR_OK                =  1;   // [�n�j]�{�^��������
  var BTNR_CANCL             =  2;   // [�L�����Z��]�{�^��������
  var BTNR_STOP              =  3;   // [���~]�{�^��������
  var BTNR_RETRI             =  4;   // [�Ď��s]�{�^��������
  var BTNR_DISRGRD           =  5;   // [����]�{�^��������
  var BTNR_YES               =  6;   // [�͂�]�{�^��������
  var BTNR_NO                =  7;   // [������]�{�^��������
  var BTNR_NOT               = -1;   // �ǂ̃{�^���������Ȃ������Ƃ�

  //�g����
//  var msgResult = wshShell.Popup(
//    '�{��', 10,
//    '�^�C�g��', (BTN_YES_NO_CANCL + ICON_QUESTN));
