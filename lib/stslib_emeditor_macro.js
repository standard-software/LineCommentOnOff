/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     EmEditor Macro Module
FileName:       stslib_emeditor_macro.js
----------------------------------------
License:        MIT License
All Right Reserved:
	Name:         Standard Software
	URL:          https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/06/16
//----------------------------------------*/

//----------------------------------------
//�Erequire�֐�
//----------------------------------------
//  �E  require/module�̖������ɑΉ�
//----------------------------------------
if (typeof module === 'undefined') {

  var requireList = requireList || {};
  var require = function (funcName) {
    for ( var item in requireList) {
      if (funcName === item) {
        if (requireList.hasOwnProperty(item)) {
          return requireList[item];
        }
      }
    }
    return undefined;
  };
}

(function () {

  if (typeof module === 'undefined') {
    var stsLib = require('stsLib')
  } else {
    var stsLib = require('./stsLib_core.js')
  }

  var stsLib = stsLib || {};
  (function () {
    var _ = stsLib;

    //���O���(�I�u�W�F�N�g)��JavaScript�̖����K��
    //�ʏ포��������J�n�A�R���X�g���N�^�����啶���J�n
    //�ɂ͉����Ă��Ȃ���
    //�G�f�B�^���Ȃ̂Ő擪�啶������J�n����
    _.EmEditorMacro = stsLib.EmEditorMacro || {};
    (function () {
      var _ = stsLib.EmEditorMacro;

      //----------------------------------------
      //����ʋ@�\
      //----------------------------------------

      var sel = document.selection;

      //�Ō�ɉ��s�R�[�h���܂ނ��ǂ����̎w����@
      _.lastLineBreakOption = { ON:0, OFF:1 };

      //----------------------------------------
      //���s�R�����g�A�E�g����
      //----------------------------------------

      //�s���R�����g�A�E�g����Ă��邩�ǂ����𔻒f����֐�
      _.isLineComment = function (line, commentMark) {
        //alert('isLineComment');
        var s = stsLib.string;
        commentMark = s.excludeEnd(commentMark, ' ');
        if (s.startsWith(
          s.trimStart(line, [' ', '\t']), commentMark)) {
          //alert('isLineComment True');
          return true;
        } else {
          //alert('isLineComment false');
          return false;
        }
      };

      //�����s���S�ăR�����g�A�E�g����Ă��邩�ǂ������f����֐�
      _.isLinesComment = function (top, bottom, commentMark) {
        var s = stsLib.string;
        var line;
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i);
          if (!s.isEmptyLine(line)) {
            if (!_.isLineComment(line, commentMark)) {
              return false;
            }
          }
        }
        return true;
      };

      //1�s���R�����g�A�E�g����֐�
      _.setLineCommentOn = function (line, indentPosition, commentMark) {
        var s = stsLib.string;
        var d = stsLib.debug;
        d.assert(indentPosition < line.length);
        return s.start(line, indentPosition) +
          commentMark +
          s.end(line, line.length - indentPosition);
      };

      //�����s���R�����g�A�E�g����֐�
      _.setLinesCommentOn = function (top, bottom, commentMark, lastLineBreak) {
        var d = stsLib.debug;
        var c = stsLib.compare;
        var s = stsLib.string;
        d.assert(c.orValue(lastLineBreak,
          _.lastLineBreakOption.ON, _.lastLineBreakOption.OFF));
        var MAX_INT= 1000;
        var indent = MAX_INT;
        var line;

        //�I��͈͂̃C���f���g�ŏ��l�����߂�
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          if (!s.isEmptyLine(line)) {
            indent = Math.min(indent,
              line.length - s.trimStart(line, [' ', '\t']).length);
          }
        }
        //alert('indent:' + indent);
        if (indent === MAX_INT) {
          indet = 0;
        }
        var result = '';
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          if (!s.isEmptyLine(line)) {
            result += _.setLineCommentOn(line, indent, commentMark);
          } else {
            result += line;
          }
        }
        if (lastLineBreak === _.lastLineBreakOption.OFF) {
          return s.trimEnd(result, ['\r', '\n']);
        } else {
          return result;
        }
      }

      //1�s���R�����g��������֐�
      _.setLineCommentOff = function (line, commentMark) {
        var s = stsLib.string;
        if (_.isLineComment(line, commentMark)) {
          var commentMarkTrimEnd = s.excludeEnd(commentMark, ' ');
          if (commentMark === commentMarkTrimEnd) {
            return s.startFirstDelim(line, commentMark) +
              s.endFirstDelim(line, commentMark);
          } else {
            var index1 = s.indexOfFirst(line, commentMark);
            var index2 = s.indexOfFirst(line, commentMarkTrimEnd);
            if (index1 === -1) {
              return s.startFirstDelim(line, commentMarkTrimEnd) +
                s.endFirstDelim(line, commentMarkTrimEnd);
            } else if (index1 <= index2) {
              return s.startFirstDelim(line, commentMark) +
                s.endFirstDelim(line, commentMark);
            } else {
              return s.startFirstDelim(line, commentMarkTrimEnd) +
                s.endFirstDelim(line, commentMarkTrimEnd);
            }
          }
        } else {
          return line;
        }
      };

      //�����s���R�����g��������֐�
      _.setLinesCommentOff = function (top, bottom, commentMark, lastLineBreak) {
        var d = stsLib.debug;
        var c = stsLib.compare;
        d.assert(c.orValue(lastLineBreak,
          _.lastLineBreakOption.ON, _.lastLineBreakOption.OFF));
        var line;
        var result = '';
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          result += _.setLineCommentOff(line, commentMark);
        }

        if (lastLineBreak === _.lastLineBreakOption.OFF) {
          return s.trimEnd(result, ['\r', '\n']);
        } else {
          return result;
        }
      };

      //�����s�̃R�����g��؂�ւ���֐�
      _.setLinesCommentOnOff = function (top, bottom, commentMark, lastLineBreak) {
        //�S�s���R�����g�A�E�g�Ȃ�R�����g����
        if (_.isLinesComment(top, bottom, commentMark)) {
          alert('setLinesCommentOff')
          return _.setLinesCommentOff(top, bottom, commentMark, lastLineBreak);
        } else {
          alert('setLinesCommentOn')
          return _.setLinesCommentOn(top, bottom, commentMark, lastLineBreak);
        }
      };

      //----------------------------------------
      //���͈̓R�����g�A�E�g����
      //----------------------------------------
      _.setRangeCommentOnOff = function (top, bottom, commentBegin, commentEnd) {
        var s = stsLib.string;
        var d = stsLib.debug;
        d.assert(top <= bottom);

        if (top === bottom) {
          var line = document.GetLine(top, eeGetLineWithNewLines);
          var lienAfterTrim =
            s.trimStart(
              s.trimEnd(line, [' ', '\t', '\r', '\n'])
              , [' ', '\t']);
          if ((s.startsWith(lienAfterTrim, commentBegin))
          && (s.endsWith(lienAfterTrim, commentEnd))) {
            //�R�����g�A�E�g����Ă���ꍇ
            //�R�����g�A�E�g�L������菜��
            return s.trimCutStart(line, [' ', '\t']) +
              s.excludeEnd(
                s.excludeStart(lienAfterTrim, commentBegin), 
                commentEnd) +
              s.trimCutEnd(line, [' ', '\t', '\r', '\n']);
          } else {
            //�R�����g�A�E�g����Ă��Ȃ��ꍇ
            //�R�����g�A�E�g�L����ǉ�
            return s.trimCutStart(line, [' ', '\t']) +
              commentBegin + 
              lienAfterTrim + 
              commentEnd + 
              s.trimCutEnd(line, [' ', '\t', '\r', '\n']);
          }
        } else {
          var lineTop = document.GetLine(top, eeGetLineWithNewLines);
          var lineTopAfterTrim = s.trimStart(lineTop, [' ', '\t']);
          var lineBottom = document.GetLine(bottom, eeGetLineWithNewLines);
          var lineBottomAfterTrim = s.trimEnd(lineBottom, [' ', '\t', '\r', '\n']);

          var textCenter = '';
          for (var i = top + 1; i <= bottom - 1; i += 1) {
            textCenter += document.GetLine(i, eeGetLineWithNewLines);
          }
          if ((s.startsWith(lineTopAfterTrim, commentBegin))
          && (s.endsWith(lineBottomAfterTrim, commentEnd))) {
            //�R�����g�A�E�g����Ă���ꍇ
            //�R�����g�A�E�g�L������菜��
            return s.trimCutStart(lineTop, [' ', '\t']) +
              s.excludeStart(lineTopAfterTrim, commentBegin) +
              textCenter +
              s.excludeEnd(lineBottomAfterTrim, commentEnd) +
              s.trimCutEnd(lineBottom, [' ', '\t', '\r', '\n']);
          } else {
            //�R�����g�A�E�g����Ă��Ȃ��ꍇ
            //�R�����g�A�E�g�L����ǉ�
            return s.trimCutStart(lineTop, [' ', '\t']) +
              commentBegin +
              lineTopAfterTrim +
              textCenter +
              lineBottomAfterTrim +
              commentEnd +
              s.trimCutEnd(lineBottom, [' ', '\t', '\r', '\n']);
          }
        }
      };

      //----------------------------------------
      //���s�I���ɂ���
      //----------------------------------------
      //  �E  lastLineBreakOption ��
      //      �ŏI�s�̉��s�R�[�h�܂őI�����邩���Ȃ�����I�ׂ�
      //  �E  lastLineBreakOption.OFF����
      //      ���������
      //      document.GetLine �̂��߂��Ǝv����
      //----------------------------------------
      _.selectLinesTopToBottom = function (top, bottom, lastLineBreak) {
        var d = stsLib.debug;
        var c = stsLib.compare;
        d.assert(top <= bottom);
        d.assert(c.orValue(lastLineBreak,
          _.lastLineBreakOption.ON, _.lastLineBreakOption.OFF));
        switch (lastLineBreak) {
        case _.lastLineBreakOption.ON:
          sel.SetActivePoint(eePosLogical, 1, top, false);
          sel.SetActivePoint(eePosLogical, 1, bottom + 1, true);
          break;
        case _.lastLineBreakOption.OFF:
          var lineLength = document.GetLine(bottom).length;
          sel.SetActivePoint(eePosLogical, 1, top, false);
          sel.SetActivePoint(eePosLogical,
            lineLength + 1, bottom, true);
          break;
        }
      };

      _.selectLinesBottomToTop = function (top, bottom, lastLineBreak) {
        var d = stsLib.debug;
        var c = stsLib.compare;
        d.assert(top <= bottom);
        d.assert(c.orValue(lastLineBreak,
          _.lastLineBreakOption.ON, _.lastLineBreakOption.OFF));
        switch (lastLineBreak) {
        case _.lastLineBreakOption.ON:
          sel.SetActivePoint(eePosLogical, 1, bottom + 1, false);
          sel.SetActivePoint(eePosLogical, 1, top, true);
          break;
        case _.lastLineBreakOption.OFF:
          sel.SetActivePoint(eePosLogical,
            document.GetLine(bottom).length + 1, bottom, false);
          sel.SetActivePoint(eePosLogical, 1, top, true);
          break;
        }
      };

    }());
  }());

  if (typeof module === 'undefined') {
    requireList['stsLib'] = stsLib;
  } else {
    module.exports = stsLib;
  }

}());
